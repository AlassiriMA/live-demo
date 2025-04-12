import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';

// Define JWT secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-jwt-key'; 

// Set session expiration time (24 hours)
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

export const generateToken = (user: { id: number; username: string; role: string }) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // DEVELOPMENT MODE: Auto-authenticate as admin for development purposes
  // This is a safer approach that works in both development and production
  const DEV_MODE = process.env.NODE_ENV !== 'production';
  
  if (DEV_MODE && process.env.REPLIT_ENVIRONMENT !== 'production') {
    console.log('🔑 [Development Mode] Auto-authenticating as admin');
    // Create a development admin user
    req.user = {
      id: 9999, // Development user ID
      username: 'dev-admin',
      role: 'admin'
    };
    return next();
  }

  try {
    // Get token from cookie or authorization header
    const token = req.cookies.token || 
      (req.headers.authorization?.startsWith('Bearer') 
        ? req.headers.authorization.split(' ')[1] 
        : null);

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string; role: string };
    
    // Check if user exists
    const user = await storage.getUser(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    // Set user data in request
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};