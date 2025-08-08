import { Request, Response } from 'express';
import db from '../config/database';
import { joinRequests } from '../db/schema';
import type { NewJoinRequest } from '../db/schema';
import { eq, desc, like, or, count } from 'drizzle-orm';

// Get all join requests (admin)
export const getJoinRequests = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;
    
    const offset = (page - 1) * limit;
    
    // Build WHERE conditions
    const conditions = [];
    
    if (status) {
      conditions.push(eq(joinRequests.status, status));
    }
    
    if (search) {
      conditions.push(
        or(
          like(joinRequests.name, `%${search}%`),
          like(joinRequests.email, `%${search}%`),
          like(joinRequests.reason, `%${search}%`)
        )
      );
    }

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(joinRequests);

    const total = totalResult.count;
    const totalPages = Math.ceil(total / limit);

    // Get paginated results
    const data = await db
      .select()
      .from(joinRequests)
      .orderBy(desc(joinRequests.created_at))
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching join requests:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch join requests' });
  }
};

// Create join request (public)
export const createJoinRequest = async (req: Request, res: Response) => {
  try {
    const newRequest: NewJoinRequest = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      reason: req.body.reason,
      experience_level: req.body.experience_level,
    };

    const [data] = await db
      .insert(joinRequests)
      .values(newRequest)
      .returning();

    res.status(201).json({ success: true, data, message: 'Join request submitted successfully' });
  } catch (error) {
    console.error('Error creating join request:', error);
    res.status(500).json({ success: false, error: 'Failed to submit join request' });
  }
};

// Update join request status (admin)
export const updateJoinRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [data] = await db
      .update(joinRequests)
      .set({ status })
      .where(eq(joinRequests.id, id))
      .returning();

    if (!data) {
      return res.status(404).json({ success: false, error: 'Join request not found' });
    }

    res.json({ success: true, data, message: `Join request ${status}` });
  } catch (error) {
    console.error('Error updating join request status:', error);
    res.status(500).json({ success: false, error: 'Failed to update join request status' });
  }
};

// Delete join request (admin)
export const deleteJoinRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [deletedRequest] = await db
      .delete(joinRequests)
      .where(eq(joinRequests.id, id))
      .returning({ id: joinRequests.id });

    if (!deletedRequest) {
      return res.status(404).json({ success: false, error: 'Join request not found' });
    }

    res.json({ success: true, message: 'Join request deleted successfully' });
  } catch (error) {
    console.error('Error deleting join request:', error);
    res.status(500).json({ success: false, error: 'Failed to delete join request' });
  }
};

// Get join request statistics (admin)
export const getJoinRequestStats = async (req: Request, res: Response) => {
  try {
    const [totalResult] = await db
      .select({ count: count() })
      .from(joinRequests);

    const [pendingResult] = await db
      .select({ count: count() })
      .from(joinRequests)
      .where(eq(joinRequests.status, 'pending'));

    const [approvedResult] = await db
      .select({ count: count() })
      .from(joinRequests)
      .where(eq(joinRequests.status, 'approved'));

    const [rejectedResult] = await db
      .select({ count: count() })
      .from(joinRequests)
      .where(eq(joinRequests.status, 'rejected'));

    res.json({
      success: true,
      data: {
        total: totalResult.count,
        pending: pendingResult.count,
        approved: approvedResult.count,
        rejected: rejectedResult.count,
      },
    });
  } catch (error) {
    console.error('Error fetching join request stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch join request stats' });
  }
};
