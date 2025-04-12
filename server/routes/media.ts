import { Router, Response, Request } from 'express';
import { z } from 'zod';
import { storage as dbStorage } from '../storage';
import { auth, AuthRequest, adminOnly } from '../middleware/auth';
import { insertMediaItemSchema } from '@shared/schema';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Configure multer for file storage
const uploadDir = path.join(process.cwd(), 'client', 'public', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for multer
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with original extension
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  }
});

// Configure upload limits and file types
const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images and PDFs
    const filetypes = /jpeg|jpg|png|gif|svg|webp|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images and PDFs are allowed'));
  }
});

// Get all media items (admin only)
router.get('/', auth, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const mediaItems = await dbStorage.getAllMediaItems();
    return res.status(200).json({ success: true, mediaItems });
  } catch (error) {
    console.error('Get media items error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get media item by ID
router.get('/:id', auth, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const mediaItem = await dbStorage.getMediaItemById(id);
    if (!mediaItem) {
      return res.status(404).json({ message: 'Media item not found' });
    }

    return res.status(200).json({ success: true, mediaItem });
  } catch (error) {
    console.error('Get media item error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create media item (admin only)
// Note: In a real application, this would handle file uploads using multer or similar
router.post('/', auth, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    // Extend schema to include the current user ID
    const createMediaSchema = insertMediaItemSchema.extend({
      uploadedBy: z.number().optional()
    });

    // Validate request
    const validation = createMediaSchema.safeParse({
      ...req.body,
      uploadedBy: req.user?.id
    });

    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    // Create media item
    const mediaItem = await dbStorage.createMediaItem(validation.data);

    // Log activity
    await dbStorage.createActivityLog({
      userId: req.user!.id,
      action: 'create',
      entityType: 'media',
      entityId: mediaItem.id,
      details: { filename: mediaItem.filename, fileType: mediaItem.fileType }
    });

    return res.status(201).json({ success: true, mediaItem });
  } catch (error) {
    console.error('Create media item error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// File upload endpoint
router.post('/upload', auth, adminOnly, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get data from request
    const data = req.body.data ? JSON.parse(req.body.data) : {};
    
    // Create url path for the uploaded file
    const relativePath = `/uploads/${req.file.filename}`;
    
    // Create media item in database
    const mediaItem = await dbStorage.createMediaItem({
      filename: req.file.originalname,
      fileType: req.file.mimetype,
      url: relativePath,
      size: req.file.size,
      uploadedBy: req.user!.id
    });

    // Log activity
    await dbStorage.createActivityLog({
      userId: req.user!.id,
      action: 'upload',
      entityType: 'media',
      entityId: mediaItem.id,
      details: { 
        filename: mediaItem.filename, 
        fileType: mediaItem.fileType,
        size: mediaItem.size
      }
    });

    return res.status(201).json({ 
      success: true, 
      mediaItem
    });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ message: 'Server error during file upload' });
  }
});

// Delete media item (admin only)
router.delete('/:id', auth, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Check if media item exists
    const existingMediaItem = await dbStorage.getMediaItemById(id);
    if (!existingMediaItem) {
      return res.status(404).json({ message: 'Media item not found' });
    }

    // Delete media item
    const deleted = await dbStorage.deleteMediaItem(id);
    if (!deleted) {
      return res.status(500).json({ message: 'Failed to delete media item' });
    }

    // Log activity
    await dbStorage.createActivityLog({
      userId: req.user!.id,
      action: 'delete',
      entityType: 'media',
      entityId: id,
      details: { filename: existingMediaItem.filename }
    });

    return res.status(200).json({ success: true, message: 'Media item deleted' });
  } catch (error) {
    console.error('Delete media item error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;