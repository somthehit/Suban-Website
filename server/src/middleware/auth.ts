import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema';
import db from '../config/database';

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-for-dev';
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Verify user still exists in database
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id))
      .limit(1);
    
    if (userResult.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid token - user not found' });
    }

    const user = userResult[0];
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(403).json({ success: false, error: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  
  next();
};
