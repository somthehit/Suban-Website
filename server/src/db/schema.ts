import { pgTable, uuid, varchar, text, boolean, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('admin'),
  avatar_url: varchar('avatar_url', { length: 500 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Blog posts table
export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  cover_image: varchar('cover_image', { length: 500 }),
  tags: jsonb('tags').$type<string[]>().default([]),
  published: boolean('published').default(false),
  author_id: uuid('author_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  published_at: timestamp('published_at'),
  meta_title: varchar('meta_title', { length: 60 }),
  meta_description: varchar('meta_description', { length: 160 }),
  read_time: integer('read_time'),
});

// Gallery table
export const gallery = pgTable('gallery', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  image_url: varchar('image_url', { length: 500 }).notNull(),
  thumbnail_url: varchar('thumbnail_url', { length: 500 }),
  caption: text('caption'),
  alt_text: varchar('alt_text', { length: 255 }).notNull(),
  tags: jsonb('tags').$type<string[]>().default([]),
  featured: boolean('featured').default(false),
  sort_order: integer('sort_order').default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});


// Contact messages table
export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  read: boolean('read').default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Join requests table
export const joinRequests = pgTable('join_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  reason: text('reason').notNull(),
  experience_level: varchar('experience_level', { length: 20 }).notNull(),
  status: varchar('status', { length: 20 }).default('pending'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Site settings table
export const siteSettings = pgTable('site_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  value: text('value').notNull(),
  type: varchar('type', { length: 20 }).default('text'),
  description: text('description'),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Payment methods table
export const paymentMethods = pgTable('payment_methods', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  details: jsonb('details').notNull(),
  qr_code: varchar('qr_code', { length: 500 }),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Donors table
export const donors = pgTable('donors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  country: varchar('country', { length: 100 }),
  avatar: varchar('avatar', { length: 500 }),
  is_anonymous: boolean('is_anonymous').default(false),
  total_donated: integer('total_donated').default(0),
  donation_count: integer('donation_count').default(0),
  last_donation: timestamp('last_donation'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Donations table
export const donations = pgTable('donations', {
  id: uuid('id').primaryKey().defaultRandom(),
  donor_id: uuid('donor_id').notNull(),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 10 }).default('USD'),
  payment_method: varchar('payment_method', { length: 100 }).notNull(),
  message: text('message'),
  is_anonymous: boolean('is_anonymous').default(false),
  status: varchar('status', { length: 20 }).default('pending'),
  transaction_id: varchar('transaction_id', { length: 255 }),
  date: timestamp('date').defaultNow().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  blogPosts: many(blogPosts),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.author_id],
    references: [users.id],
  }),
}));

// Relations for donations
export const donorsRelations = relations(donors, ({ many }) => ({
  donations: many(donations),
}));

export const donationsRelations = relations(donations, ({ one }) => ({
  donor: one(donors, {
    fields: [donations.donor_id],
    references: [donors.id],
  }),
}));

// Type exports for use in controllers
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type Gallery = typeof gallery.$inferSelect;
export type NewGallery = typeof gallery.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
export type JoinRequest = typeof joinRequests.$inferSelect;
export type NewJoinRequest = typeof joinRequests.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type NewPaymentMethod = typeof paymentMethods.$inferInsert;
export type Donor = typeof donors.$inferSelect;
export type NewDonor = typeof donors.$inferInsert;
export type Donation = typeof donations.$inferSelect;
export type NewDonation = typeof donations.$inferInsert;

// Tourism table
export const tourism = pgTable('tourism', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type', { length: 50 }).notNull(), // tour, homestay, event, activity
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  shortDescription: varchar('short_description', { length: 255 }),
  location: varchar('location', { length: 255 }),
  duration: varchar('duration', { length: 50 }),
  price: integer('price'), // Price in cents to avoid decimal issues
  currency: varchar('currency', { length: 10 }).default('USD'),
  category: varchar('category', { length: 100 }),
  difficulty: varchar('difficulty', { length: 50 }),
  rating: integer('rating').default(0), // Rating * 10 (e.g., 45 = 4.5 stars)
  reviewCount: integer('review_count').default(0),
  images: jsonb('images').$type<{url: string, alt: string}[]>(),
  availability: jsonb('availability').$type<{seasonal: boolean, months: string[], daysOfWeek: string[]}>(),
  featured: boolean('featured').default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Tourism = typeof tourism.$inferSelect;
export type NewTourism = typeof tourism.$inferInsert;
