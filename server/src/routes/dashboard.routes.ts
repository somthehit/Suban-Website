import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { db } from '../config/database';
import { gallery, blogPosts, contactMessages, joinRequests } from '../db/schema';
import { sql, count, eq } from 'drizzle-orm';

const router = Router();

// GET /admin/dashboard/stats - Get dashboard statistics
router.get('/admin/dashboard/stats', authenticateToken, async (req: Request, res: Response) => {
  try {
    const [
      galleryStats,
      blogStats,
      messageStats,
      joinRequestStats
    ] = await Promise.all([
      // Gallery stats
      db.select({
        total: count(),
        featured: sql<number>`COALESCE(SUM(CASE WHEN featured = true THEN 1 ELSE 0 END), 0)`
      }).from(gallery),
      
      // Blog stats
      db.select({
        total: count(),
        published: sql<number>`COALESCE(SUM(CASE WHEN published = true THEN 1 ELSE 0 END), 0)`
      }).from(blogPosts),
      
      // Message stats
      db.select({
        total: count(),
        unread: sql<number>`COALESCE(SUM(CASE WHEN read = false THEN 1 ELSE 0 END), 0)`
      }).from(contactMessages),
      
      // Join request stats
      db.select({
        total: count(),
        pending: sql<number>`COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0)`,
        approved: sql<number>`COALESCE(SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END), 0)`,
        rejected: sql<number>`COALESCE(SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END), 0)`
      }).from(joinRequests)
    ]);

    const stats = {
      gallery: {
        total: galleryStats[0]?.total || 0,
        featured: galleryStats[0]?.featured || 0
      },
      blog: {
        total: blogStats[0]?.total || 0,
        published: blogStats[0]?.published || 0
      },
      messages: {
        total: messageStats[0]?.total || 0,
        unread: messageStats[0]?.unread || 0
      },
      joinRequests: {
        total: joinRequestStats[0]?.total || 0,
        pending: joinRequestStats[0]?.pending || 0,
        approved: joinRequestStats[0]?.approved || 0,
        rejected: joinRequestStats[0]?.rejected || 0
      }
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
});

export default router;
