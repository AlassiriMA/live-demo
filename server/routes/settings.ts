import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { auth, adminOnly, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all settings
router.get('/', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const settings = category 
      ? await storage.getSettingsByCategory(category) 
      : await storage.getAllSettings();
    
    // Convert to key-value format for easier consumption in frontend
    const settingsObj = settings.reduce((acc: Record<string, any>, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    
    res.json({ success: true, settings: settingsObj });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
});

// Get setting by key
router.get('/:key', async (req: Request, res: Response) => {
  try {
    const key = req.params.key;
    const setting = await storage.getSettingByKey(key);
    
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    
    res.json({ success: true, setting });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch setting' });
  }
});

// Update setting (admin only)
router.patch('/:key', auth, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const key = req.params.key;
    const { value } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    if (value === undefined) {
      return res.status(400).json({ success: false, message: 'Value is required' });
    }
    
    const updatedSetting = await storage.updateSetting(key, value, userId);
    
    if (!updatedSetting) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    
    res.json({ success: true, setting: updatedSetting });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ success: false, message: 'Failed to update setting' });
  }
});

export default router;