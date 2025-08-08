import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema';
import { db } from '../config/database';

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  try {
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (userResult.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const user = userResult[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-for-dev';
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '24h' });

    // Remove password from user object before sending
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({ 
      success: true, 
      data: { 
        token, 
        user: userWithoutPassword 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};
