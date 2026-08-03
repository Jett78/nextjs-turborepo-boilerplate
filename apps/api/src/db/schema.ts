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
  id: uuid('id').defaultRandom().primaryKey(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  companyDescription: text('company_description'),
  address: text('address'),
  phoneNumber: varchar('phone_number', { length: 50 }),
  email: varchar('email', { length: 255 }),
  logoKey: varchar('logo_key', { length: 500 }),
  footerLogoKey: varchar('footer_logo_key', { length: 500 }),
  faviconKey: varchar('favicon_key', { length: 500 }),
  whatsappNumber: varchar('whatsapp_number', { length: 50 }),
  googleMap: text('google_map'),
  primaryColor: varchar('primary_color', { length: 50 }),
  secondaryColor: varchar('secondary_color', { length: 50 }),
  facebookUrl: varchar('facebook_url', { length: 500 }),
  instagramUrl: varchar('instagram_url', { length: 500 }),
  tiktokUrl: varchar('tiktok_url', { length: 500 }),
  twitterUrl: varchar('twitter_url', { length: 500 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
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
  blogId: uuid('blog_id').references(() => blogs.id, { onDelete: 'cascade' }),
  companyProfileId: uuid('company_profile_id').references(() => companyProfiles.id, { onDelete: 'cascade' }),
});

export const blogsRelations = relations(blogs, ({ one }) => ({
  seoMeta: one(seoMetas, {
    fields: [blogs.id],
    references: [seoMetas.blogId],
  }),
}));

export const companyProfilesRelations = relations(companyProfiles, ({ one }) => ({}));

export const seoMetasRelations = relations(seoMetas, ({ one }) => ({
  blog: one(blogs, {
    fields: [seoMetas.blogId],
    references: [blogs.id],
  }),
}));

// Global SEO settings (site-wide meta, GTM, Search Console)
export const globalSeo = pgTable('global_seo', {
  id: uuid('id').defaultRandom().primaryKey(),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  metaKeywords: text('meta_keywords').array(),
  ogTitle: varchar('og_title', { length: 255 }),
  ogDescription: text('og_description'),
  ogImageKey: varchar('og_image_key', { length: 500 }),
  gtmContainerId: varchar('gtm_container_id', { length: 100 }),
  googleSearchConsoleVerification: varchar('google_search_console_verification', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Per-page SEO settings
export const pageSeo = pgTable('page_seo', {
  id: uuid('id').defaultRandom().primaryKey(),
  pagePath: varchar('page_path', { length: 500 }).notNull().unique(),
  pageTitle: varchar('page_title', { length: 255 }),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  ogTitle: varchar('og_title', { length: 255 }),
  ogDescription: text('og_description'),
  ogImageKey: varchar('og_image_key', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  pagePathIdx: index('page_seo_page_path_idx').on(table.pagePath),
}));

export const testimonials = pgTable('testimonials', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  message: text('message').notNull(),
  avatar: varchar('avatar', { length: 500 }),
  designation: varchar('designation', { length: 255 }),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  sortOrderIdx: index('testimonials_sort_order_idx').on(table.sortOrder),
}));

export const teamMembers = pgTable('team_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  designation: varchar('designation', { length: 255 }),
  joinedDate: timestamp('joined_date', { withTimezone: true }),
  message: text('message'),
  avatar: varchar('avatar', { length: 500 }),
  whatsappUrl: varchar('whatsapp_url', { length: 500 }),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('team_members_slug_idx').on(table.slug),
  sortOrderIdx: index('team_members_sort_order_idx').on(table.sortOrder),
}));

export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  imageKey: varchar('image_key', { length: 500 }),
  shortDescription: varchar('short_description', { length: 500 }),
  description: text('description'),
  price: integer('price'),
  offerPrice: integer('offer_price'),
  features: text('features').array(),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('services_slug_idx').on(table.slug),
  sortOrderIdx: index('services_sort_order_idx').on(table.sortOrder),
}));

export const faqs = pgTable('faqs', {
  id: uuid('id').defaultRandom().primaryKey(),
  question: varchar('question', { length: 500 }).notNull(),
  answer: text('answer').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  sortOrderIdx: index('faqs_sort_order_idx').on(table.sortOrder),
}));

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const paymentSettings = pgTable('payment_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  provider: varchar('provider', { length: 50 }).notNull().unique(),
  secretKey: text('secret_key').notNull(),
  publicKey: text('public_key').notNull(),
  apiUrl: varchar('api_url', { length: 500 }).notNull(),
  isEnabled: boolean('is_enabled').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded', 'expired', 'cancelled']);

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: varchar('order_id', { length: 255 }).notNull().unique(),
  pidx: varchar('pidx', { length: 255 }),
  userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
  productName: varchar('product_name', { length: 255 }).notNull(),
  productId: varchar('product_id', { length: 255 }).notNull(),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 10 }).default('NPR').notNull(),
  status: paymentStatusEnum('status').default('pending').notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }),
  transactionId: varchar('transaction_id', { length: 255 }),
  customerName: varchar('customer_name', { length: 255 }),
  customerEmail: varchar('customer_email', { length: 255 }),
  customerPhone: varchar('customer_phone', { length: 50 }),
  metadata: text('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  orderIdIdx: index('orders_order_id_idx').on(table.orderId),
  pidxIdx: index('orders_pidx_idx').on(table.pidx),
  userIdIdx: index('orders_user_id_idx').on(table.userId),
  statusIdx: index('orders_status_idx').on(table.status),
}));

// Better Auth tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  role: varchar('role', { length: 50 }).default('customer').notNull(),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  password: text('password'),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
  scope: text('scope'),
  idTokenClaims: text('id_token_claims'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Custom Domains
export const domainStatusEnum = pgEnum('domain_status', ['pending', 'verifying', 'verified', 'active', 'failed']);
export const sslStatusEnum = pgEnum('ssl_status', ['pending', 'active', 'failed', 'none']);
export const deploymentStatusEnum = pgEnum('deployment_status', ['pending', 'deploying', 'deployed', 'failed']);

export const customDomains = pgTable('custom_domains', {
  id: uuid('id').defaultRandom().primaryKey(),
  domain: varchar('domain', { length: 255 }).notNull().unique(),
  status: domainStatusEnum('status').default('pending').notNull(),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  sslStatus: sslStatusEnum('ssl_status').default('none').notNull(),
  sslIssuedAt: timestamp('ssl_issued_at', { withTimezone: true }),
  deploymentStatus: deploymentStatusEnum('deployment_status').default('pending').notNull(),
  errorMessage: text('error_message'),
  dnsRecordsChecked: text('dns_records_checked'),
  dokployDomainId: varchar('dokploy_domain_id', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  domainIdx: index('custom_domains_domain_idx').on(table.domain),
  statusIdx: index('custom_domains_status_idx').on(table.status),
}));
