import { pgTable, serial, varchar, timestamp, text, boolean, integer, uuid, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const companyProfiles = pgTable('company_profiles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  website: varchar('website', { length: 500 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  logo: varchar('logo', { length: 500 }),
  founded: integer('founded'),
  industry: varchar('industry', { length: 100 }),
  employeeCount: integer('employee_count'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const blogs = pgTable('blogs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  imageKey: varchar('image_key', { length: 500 }),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('blogs_slug_idx').on(table.slug),
}));

export const seoMetas = pgTable('seo_metas', {
  id: uuid('id').defaultRandom().primaryKey(),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  metaKeywords: text('meta_keywords').array(),
  canonicalUrl: varchar('canonical_url', { length: 500 }),
  metaRobots: varchar('meta_robots', { length: 100 }).default('index, follow'),
  ogTitle: varchar('og_title', { length: 255 }),
  ogDescription: text('og_description'),
  ogImageKey: varchar('og_image_key', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  blogId: uuid('blog_id').unique().references(() => blogs.id, { onDelete: 'cascade' }),
});

export const blogsRelations = relations(blogs, ({ one }) => ({
  seoMeta: one(seoMetas, {
    fields: [blogs.id],
    references: [seoMetas.blogId],
  }),
}));

export const seoMetasRelations = relations(seoMetas, ({ one }) => ({
  blog: one(blogs, {
    fields: [seoMetas.blogId],
    references: [blogs.id],
  }),
}));
