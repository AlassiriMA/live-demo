import { Router, Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { storage } from '../storage';
import { generateToken, auth, AuthRequest, adminOnly } from '../middleware/auth';

const router = Router();

// Login validation schema
const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(1) // Reduced minimum length for development purposes
});

// Register validation schema
const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(1), // Reduced for dev purposes
  role: z.enum(['user', 'admin']).default('user')
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Validate request
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { username, password } = validation.data;

    // DEV MODE: Hardcoded admin user for development
    const DEV_MODE = true; // Set to false for production
    
    if (DEV_MODE && username === 'admin' && password === 'admin') {
      console.log('🔑 [Development Mode] Authenticating as admin using hardcoded credentials');
      // Simulate an admin user
      const devUser = {
        id: 9999,
        username: 'admin',
        password: 'admin', // Not used but needed for type compliance
        role: 'admin'
      };
      
      // Generate token for dev user
      const token = generateToken({
        id: devUser.id,
        username: devUser.username,
        role: devUser.role
      });
      
      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: 'strict'
      });
      
      // Return success with dev user info (exclude password)
      return res.status(200).json({
        success: true,
        user: {
          id: devUser.id,
          username: devUser.username,
          role: devUser.role
        },
        token
      });
    }

    // Normal flow for production
    // Find user
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    // For direct plain password comparison (temporary fix)
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: 'strict'
    });

    // Return success with user info (exclude password)
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Register route (admin only)
router.post('/register', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    // Validate request
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { username, password, role } = validation.data;

    // Check if user exists
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await storage.createUser({
      username,
      password: hashedPassword,
      role
    });

    // Log activity
    await storage.createActivityLog({
      userId: (req as AuthRequest).user!.id,
      action: 'create',
      entityType: 'user',
      entityId: user.id,
      details: { username: user.username, role: user.role }
    });

    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  return res.status(200).json({
    success: true,
    user
  });
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  return res.status(200).json({ success: true, message: 'Logged out' });
});

export default router;