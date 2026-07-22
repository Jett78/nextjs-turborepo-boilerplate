import { pgTable, serial, varchar, timestamp, text, boolean, integer, uuid, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', ['super_admin', 'admin', 'manager', 'customer']);
export const authProviderEnum = pgEnum('auth_provider', ['email', 'google', 'github']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }),
  imageKey: varchar('image_key', { length: 500 }),
  role: userRoleEnum('role').default('super_admin').notNull(),
  provider: authProviderEnum('provider').default('email').notNull(),
  providerId: varchar('provider_id', { length: 255 }),
  providerData: text('provider_data'),
  isActive: boolean('is_active').default(true).notNull(),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),
  isPhoneVerified: boolean('is_phone_verified').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  phoneIdx: index('users_phone_idx').on(table.phone),
  isActiveIdx: index('users_is_active_idx').on(table.isActive),
  roleIdx: index('users_role_idx').on(table.role),
}));

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
