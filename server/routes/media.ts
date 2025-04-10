import { Router, Response } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { auth, AuthRequest, adminOnly } from '../middleware/auth';
import { insertMediaItemSchema } from '@shared/schema';

const router = Router();

// Get all media items (admin only)
router.get('/', auth, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const mediaItems = await storage.getAllMediaItems();
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

    const mediaItem = await storage.getMediaItemById(id);
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
    const mediaItem = await storage.createMediaItem(validation.data);

    // Log activity
    await storage.createActivityLog({
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

// Delete media item (admin only)
router.delete('/:id', auth, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Check if media item exists
    const existingMediaItem = await storage.getMediaItemById(id);
    if (!existingMediaItem) {
      return res.status(404).json({ message: 'Media item not found' });
    }

    // Delete media item
    const deleted = await storage.deleteMediaItem(id);
    if (!deleted) {
      return res.status(500).json({ message: 'Failed to delete media item' });
    }

    // Log activity
    await storage.createActivityLog({
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