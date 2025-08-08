import { pgTable, uuid, varchar, text, boolean, decimal, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

// Tourism table
export const tourism = pgTable('tourism', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type', { length: 50 }).notNull(), // tour, homestay, event, activity
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  shortDescription: varchar('short_description', { length: 255 }),
  location: varchar('location', { length: 255 }),
  duration: varchar('duration', { length: 50 }),
  price: decimal('price', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 10 }).default('USD'),
  category: varchar('category', { length: 100 }),
  difficulty: varchar('difficulty', { length: 50 }),
  rating: decimal('rating', { precision: 3, scale: 2 }).default(0),
  reviewCount: integer('review_count').default(0),
  images: jsonb('images').$type<{url: string, alt: string}[]>(),
  availability: jsonb('availability').$type<{seasonal: boolean, months: string[], daysOfWeek: string[]}>(),
  featured: boolean('featured').default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Tourism = typeof tourism.$inferSelect;
export type NewTourism = typeof tourism.$inferInsert;

