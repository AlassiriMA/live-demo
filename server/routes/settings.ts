import { Router, Response } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { auth, AuthRequest, adminOnly } from '../middleware/auth';

const router = Router();

// Validation schema for updating settings
const updateSettingSchema = z.object({
  value: z.any(),
  category: z.string().optional()
});

// Get all settings (admin only)
router.get('/', auth, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const settings = await storage.getAllSettings();
    return res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error('Get settings error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get settings by category (admin only)
router.get('/category/:category', auth, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const category = req.params.category;
    const settings = await storage.getSettingsByCategory(category);
    return res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error('Get settings by category error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get setting by key
router.get('/:key', auth, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const key = req.params.key;
    const setting = await storage.getSettingByKey(key);
    
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    
    return res.status(200).json({ success: true, setting });
  } catch (error) {
    console.error('Get setting error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update setting (admin only)
router.put('/:key', auth, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const key = req.params.key;
    
    // Validate request
    const validation = updateSettingSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }
    
    // Update setting
    const updatedSetting = await storage.updateSetting(
      key, 
      validation.data.value, 
      req.user!.id
    );
    
    if (!updatedSetting) {
      return res.status(500).json({ message: 'Failed to update setting' });
    }
    
    // Log activity
    await storage.createActivityLog({
      userId: req.user!.id,
      action: 'update',
      entityType: 'setting',
      entityId: updatedSetting.id,
      details: { key: updatedSetting.key, category: updatedSetting.category }
    });
    
    return res.status(200).json({ success: true, setting: updatedSetting });
  } catch (error) {
    console.error('Update setting error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;