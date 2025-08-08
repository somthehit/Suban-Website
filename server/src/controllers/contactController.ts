import { Request, Response } from 'express';
import db from '../config/database';
import { contactMessages } from '../db/schema';
import type { NewContactMessage } from '../db/schema';
import { eq, desc, like, or, count, sql } from 'drizzle-orm';

// Get all contact messages (admin)
export const getContactMessages = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const read = req.query.read as string;
    
    const offset = (page - 1) * limit;
    
    // Build WHERE conditions
    const conditions = [];
    
    if (read !== undefined) {
      conditions.push(eq(contactMessages.read, read === 'true'));
    }
    
    if (search) {
      conditions.push(
        or(
          like(contactMessages.name, `%${search}%`),
          like(contactMessages.email, `%${search}%`),
          like(contactMessages.subject, `%${search}%`),
          like(contactMessages.message, `%${search}%`)
        )
      );
    }

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(contactMessages);

    const total = totalResult.count;
    const totalPages = Math.ceil(total / limit);

    // Get paginated results
    const data = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.created_at))
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
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch contact messages' });
  }
};

// Create contact message (public)
export const createContactMessage = async (req: Request, res: Response) => {
  try {
    const newMessage: NewContactMessage = {
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    };

    const [data] = await db
      .insert(contactMessages)
      .values(newMessage)
      .returning();

    res.status(201).json({ success: true, data, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
};

// Mark message as read/unread (admin)
export const updateMessageReadStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { read } = req.body;

    const [data] = await db
      .update(contactMessages)
      .set({ read })
      .where(eq(contactMessages.id, id))
      .returning();

    if (!data) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.json({ success: true, data, message: `Message marked as ${read ? 'read' : 'unread'}` });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ success: false, error: 'Failed to update message status' });
  }
};

// Delete contact message (admin)
export const deleteContactMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [deletedMessage] = await db
      .delete(contactMessages)
      .where(eq(contactMessages.id, id))
      .returning({ id: contactMessages.id });

    if (!deletedMessage) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ success: false, error: 'Failed to delete message' });
  }
};

// Bulk delete messages (admin)
export const bulkDeleteMessages = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid message IDs' });
    }

    const deletedMessages = await db
      .delete(contactMessages)
      .where(sql`${contactMessages.id} = ANY(${ids})`)
      .returning({ id: contactMessages.id });

    res.json({ 
      success: true, 
      message: `${deletedMessages.length} message(s) deleted successfully` 
    });
  } catch (error) {
    console.error('Error bulk deleting messages:', error);
    res.status(500).json({ success: false, error: 'Failed to delete messages' });
  }
};

// Get message statistics (admin)
export const getMessageStats = async (req: Request, res: Response) => {
  try {
    const [totalResult] = await db
      .select({ count: count() })
      .from(contactMessages);

    const [unreadResult] = await db
      .select({ count: count() })
      .from(contactMessages)
      .where(eq(contactMessages.read, false));

    res.json({
      success: true,
      data: {
        total: totalResult.count,
        unread: unreadResult.count,
        read: totalResult.count - unreadResult.count,
      },
    });
  } catch (error) {
    console.error('Error fetching message stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch message stats' });
  }
};
