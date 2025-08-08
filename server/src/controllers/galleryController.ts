import { Request, Response } from 'express';
import db from '../config/database';
import { gallery } from '../db/schema';
import type { NewGallery } from '../db/schema';
import { galleryQuerySchema, createGalleryImageSchema, updateGalleryImageSchema } from '@suban/shared';
import { PAGINATION } from '@suban/shared';
import { eq, desc, like, or, sql, count, and } from 'drizzle-orm';

// Get all gallery images (public)
export const getGalleryImages = async (req: Request, res: Response) => {
  try {
    const query = galleryQuerySchema.parse({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || PAGINATION.GALLERY_IMAGES_PER_PAGE,
      category: req.query.category as string,
      featured: req.query.featured !== undefined ? req.query.featured === 'true' : undefined,
      tag: req.query.tag as string,
    });

    // Build WHERE conditions
    const conditions = [];
    
    // Filter by category
    if (query.category) {
      conditions.push(eq(gallery.category, query.category));
    }
    
    // Filter by featured status
    if (query.featured !== undefined) {
      conditions.push(eq(gallery.featured, query.featured));
    }

    // Filter by tag
    if (query.tag) {
      conditions.push(sql`${gallery.tags} @> ${JSON.stringify([query.tag])}`);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count for pagination
    const [totalResult] = await db
      .select({ count: count() })
      .from(gallery)
      .where(whereClause);

    const total = totalResult.count;
    const totalPages = Math.ceil(total / query.limit);
    const offset = (query.page - 1) * query.limit;

    // Get paginated results
    const data = await db
      .select()
      .from(gallery)
      .where(whereClause)
      .orderBy(gallery.sort_order, desc(gallery.created_at))
      .limit(query.limit)
      .offset(offset);

    res.json({
      success: true,
      data,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNext: query.page < totalPages,
        hasPrev: query.page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch gallery images' });
  }
};

// Get featured images for homepage
export const getFeaturedImages = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;

    const data = await db
      .select()
      .from(gallery)
      .where(eq(gallery.featured, true))
      .orderBy(gallery.sort_order, desc(gallery.created_at))
      .limit(limit);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching featured images:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch featured images' });
  }
};

// Get single gallery image by ID (public)
export const getGalleryImageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [data] = await db
      .select()
      .from(gallery)
      .where(eq(gallery.id, id))
      .limit(1);

    if (!data) {
      return res.status(404).json({ success: false, error: 'Gallery image not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch gallery image' });
  }
};

// Get gallery categories
export const getGalleryCategories = async (req: Request, res: Response) => {
  try {
    const categories = await db
      .selectDistinct({ category: gallery.category })
      .from(gallery)
      .orderBy(gallery.category);

    const data = categories.map(item => item.category);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching gallery categories:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch gallery categories' });
  }
};

// Create gallery image (admin)
export const createGalleryImage = async (req: Request, res: Response) => {
  try {
    const validatedData = createGalleryImageSchema.parse(req.body);

    const newImage: NewGallery = {
      ...validatedData,
    };

    const [data] = await db
      .insert(gallery)
      .values(newImage)
      .returning();

    res.status(201).json({ success: true, data, message: 'Gallery image created successfully' });
  } catch (error) {
    console.error('Error creating gallery image:', error);
    res.status(500).json({ success: false, error: 'Failed to create gallery image' });
  }
};

// Update gallery image (admin)
export const updateGalleryImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateGalleryImageSchema.parse(req.body);

    const updateData = {
      ...validatedData,
      updated_at: new Date(),
    };

    const [data] = await db
      .update(gallery)
      .set(updateData)
      .where(eq(gallery.id, id))
      .returning();

    if (!data) {
      return res.status(404).json({ success: false, error: 'Gallery image not found' });
    }

    res.json({ success: true, data, message: 'Gallery image updated successfully' });
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({ success: false, error: 'Failed to update gallery image' });
  }
};

// Delete gallery image (admin)
export const deleteGalleryImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [deletedImage] = await db
      .delete(gallery)
      .where(eq(gallery.id, id))
      .returning({ id: gallery.id });

    if (!deletedImage) {
      return res.status(404).json({ success: false, error: 'Gallery image not found' });
    }

    res.json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ success: false, error: 'Failed to delete gallery image' });
  }
};
