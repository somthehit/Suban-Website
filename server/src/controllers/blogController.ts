import { Request, Response } from 'express';
import db from '../config/database';
import { blogPosts } from '../db/schema';
import type { NewBlogPost } from '../db/schema';
import { blogQuerySchema, createBlogPostSchema, updateBlogPostSchema } from '@suban/shared';
import { PAGINATION } from '@suban/shared';
import { eq, desc, like, or, sql, count, and, arrayContains } from 'drizzle-orm';
import slugify from 'slugify';

// Get all blog posts (public)
export const getBlogPosts = async (req: Request, res: Response) => {
  try {
    const query = blogQuerySchema.parse({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || PAGINATION.BLOG_POSTS_PER_PAGE,
      published: req.query.published !== undefined ? req.query.published === 'true' : true,
      tag: req.query.tag as string,
      search: req.query.search as string,
    });

    // Build WHERE conditions
    const conditions = [];
    
    // Filter by published status
    if (query.published !== undefined) {
      conditions.push(eq(blogPosts.published, query.published));
    }

    // Filter by tag
    if (query.tag) {
      conditions.push(sql`${blogPosts.tags} @> ${JSON.stringify([query.tag])}`);
    }

    // Search functionality
    if (query.search) {
      conditions.push(
        or(
          like(blogPosts.title, `%${query.search}%`),
          like(blogPosts.content, `%${query.search}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count for pagination
    const [totalResult] = await db
      .select({ count: count() })
      .from(blogPosts)
      .where(whereClause);

    const total = totalResult.count;
    const totalPages = Math.ceil(total / query.limit);
    const offset = (query.page - 1) * query.limit;

    // Get paginated results
    const data = await db
      .select()
      .from(blogPosts)
      .where(whereClause)
      .orderBy(desc(blogPosts.created_at))
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
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch blog posts' });
  }
};

// Get single blog post by slug (public)
export const getBlogPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const [data] = await db
      .select()
      .from(blogPosts)
      .where(and(
        eq(blogPosts.slug, slug),
        eq(blogPosts.published, true)
      ))
      .limit(1);

    if (!data) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch blog post' });
  }
};

// Get single blog post by ID (admin)
export const getBlogPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [data] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    if (!data) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch blog post' });
  }
};

// Create blog post (admin)
export const createBlogPost = async (req: Request, res: Response) => {
  try {
    const validatedData = createBlogPostSchema.parse(req.body);
    
    // Generate slug if not provided
    if (!validatedData.slug) {
      validatedData.slug = slugify(validatedData.title, { lower: true, strict: true });
    }

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = validatedData.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    // Generate excerpt if not provided
    if (!validatedData.excerpt) {
      const plainText = validatedData.content.replace(/<[^>]*>/g, '');
      validatedData.excerpt = plainText.substring(0, 300) + (plainText.length > 300 ? '...' : '');
    }

    const newPost: NewBlogPost = {
      ...validatedData,
      author_id: req.user?.id || '', // Assuming user is attached to request
      read_time: readTime,
      published_at: validatedData.published ? new Date() : null,
    };

    const [data] = await db
      .insert(blogPosts)
      .values(newPost)
      .returning();

    res.status(201).json({ success: true, data, message: 'Blog post created successfully' });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ success: false, error: 'Failed to create blog post' });
  }
};

// Update blog post (admin)
export const updateBlogPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let validatedData = updateBlogPostSchema.parse(req.body);

    // Generate slug if title changed
    if (validatedData.title) {
      validatedData.slug = slugify(validatedData.title, { lower: true, strict: true });
    }

    // Calculate read time if content changed
    if (validatedData.content) {
      const wordCount = validatedData.content.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);
      validatedData = { ...validatedData, read_time: readTime } as any;
    }

    // Generate excerpt if content changed and no excerpt provided
    if (validatedData.content && !validatedData.excerpt) {
      const plainText = validatedData.content.replace(/<[^>]*>/g, '');
      validatedData.excerpt = plainText.substring(0, 300) + (plainText.length > 300 ? '...' : '');
    }

    // Set published_at if publishing for the first time
    let publishedAt = undefined;
    if (validatedData.published) {
      const [existingPost] = await db
        .select({ published_at: blogPosts.published_at })
        .from(blogPosts)
        .where(eq(blogPosts.id, id))
        .limit(1);

      if (existingPost && !existingPost.published_at) {
        publishedAt = new Date();
      }
    }

    const updateData = {
      ...validatedData,
      ...(publishedAt && { published_at: publishedAt }),
      updated_at: new Date(),
    };

    const [data] = await db
      .update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))
      .returning();

    if (!data) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }

    res.json({ success: true, data, message: 'Blog post updated successfully' });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ success: false, error: 'Failed to update blog post' });
  }
};

// Delete blog post (admin)
export const deleteBlogPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [deletedPost] = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning({ id: blogPosts.id });

    if (!deletedPost) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }

    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ success: false, error: 'Failed to delete blog post' });
  }
};
