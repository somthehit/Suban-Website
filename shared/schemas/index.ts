import { z } from 'zod';

// Blog Post Schemas
export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(300, 'Excerpt too long').optional(),
  cover_image: z.string().url('Invalid image URL').optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  meta_title: z.string().max(60, 'Meta title too long').optional(),
  meta_description: z.string().max(160, 'Meta description too long').optional(),
});

export const createBlogPostSchema = blogPostSchema;
export const updateBlogPostSchema = blogPostSchema.partial();

// Gallery Schemas
export const galleryImageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  category: z.string().min(1, 'Category is required'),
  image_url: z.string().url('Invalid image URL'),
  thumbnail_url: z.string().url('Invalid thumbnail URL').optional(),
  caption: z.string().max(500, 'Caption too long').optional(),
  alt_text: z.string().min(1, 'Alt text is required').max(200, 'Alt text too long'),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
});

export const createGalleryImageSchema = galleryImageSchema;
export const updateGalleryImageSchema = galleryImageSchema.partial();

// Homepage Gallery Schema
export const homepageGallerySchema = z.object({
  gallery_image_id: z.string().uuid('Invalid gallery image ID'),
  position: z.number().int().min(0).default(0),
  size: z.enum(['small', 'medium', 'large']).default('medium'),
  is_active: z.boolean().default(true),
});

export const createHomepageGallerySchema = homepageGallerySchema;
export const updateHomepageGallerySchema = homepageGallerySchema.partial();

// Contact Message Schema
export const contactMessageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(200, 'Subject too long').optional(),
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
});

// Join Request Schema
export const joinRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20, 'Phone number too long').optional(),
  reason: z.string().min(1, 'Reason is required').max(1000, 'Reason too long'),
  experience_level: z.enum(['beginner', 'intermediate', 'advanced']),
});

// Site Settings Schema
export const siteSettingSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string(),
  type: z.enum(['text', 'textarea', 'boolean', 'json']).default('text'),
  description: z.string().optional(),
});

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
});

// Pagination Schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

// Query Schemas
export const blogQuerySchema = z.object({
  published: z.boolean().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  ...paginationSchema.shape,
});

export const galleryQuerySchema = z.object({
  category: z.string().optional(),
  featured: z.boolean().optional(),
  tag: z.string().optional(),
  ...paginationSchema.shape,
});

// File Upload Schema
export const fileUploadSchema = z.object({
  file: z.any(),
  bucket: z.enum(['blog-images', 'gallery-images', 'site-assets']),
  folder: z.string().optional(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type GalleryImageInput = z.infer<typeof galleryImageSchema>;
export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>;
export type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
export type JoinRequestInput = z.infer<typeof joinRequestSchema>;
export type SiteSettingInput = z.infer<typeof siteSettingSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type BlogQueryInput = z.infer<typeof blogQuerySchema>;
export type GalleryQueryInput = z.infer<typeof galleryQuerySchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type HomepageGalleryInput = z.infer<typeof homepageGallerySchema>;
export type CreateHomepageGalleryInput = z.infer<typeof createHomepageGallerySchema>;
export type UpdateHomepageGalleryInput = z.infer<typeof updateHomepageGallerySchema>;
