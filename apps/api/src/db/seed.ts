import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { hashPassword } from 'better-auth/crypto';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  try {
    // Seed super admin user in Better Auth user table
    const existingAdmin = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, 'admin@page.com'))
      .limit(1);

    if (existingAdmin.length === 0) {
      const userId = randomUUID();
      const passwordHash = await hashPassword('Admin@123');

      await db.insert(schema.user).values({
        id: userId,
        name: 'Super Admin',
        email: 'admin@page.com',
        emailVerified: true,
        role: 'super_admin',
      });

      await db.insert(schema.account).values({
        id: randomUUID(),
        accountId: userId,
        providerId: 'credential',
        userId,
        password: passwordHash,
      });

      console.log('Super admin created successfully!');
      console.log('Email: admin@page.com');
      console.log('Password: Admin@123');
    } else {
      // Ensure existing admin has super_admin role
      if (existingAdmin[0].role !== 'super_admin') {
        await db
          .update(schema.user)
          .set({ role: 'super_admin' })
          .where(eq(schema.user.email, 'admin@page.com'));
        console.log('Updated existing admin to super_admin role.');
      }
      console.log('Super admin already exists, skipping.');
    }

    // Seed company profile
    const existingProfile = await db
      .select()
      .from(schema.companyProfiles)
      .limit(1);

    if (existingProfile.length === 0) {
      const [profile] = await db
        .insert(schema.companyProfiles)
        .values({
          companyName: 'Boiler Plate',
          companyDescription: 'Nextjs turbo Repo Boiler Plate',
          address: 'Kathmandu, Nepal',
          phoneNumber: '+977-9800000000',
          email: 'info@nepaltech.com',
          logoKey: 'string',
          footerLogoKey: 'string',
          faviconKey: 'string',
          whatsappNumber: '+977-9800000000',
          googleMap: '<iframe>...</iframe>',
          primaryColor: '221.2 83.2% 53.3%',
          secondaryColor: '210 40% 96.1%',
          textForeground: '222.2 84% 4.9%',
          facebookUrl: 'https://facebook.com/mycompany',
          instagramUrl: 'https://instagram.com/mycompany',
          isActive: true,
        })
        .returning();

      await db
        .insert(schema.seoMetas)
        .values({
          metaTitle: 'My Awesome Page Title',
          metaDescription: 'This is a description of my awesome page.',
          canonicalUrl: 'https://example.com/canonical-url',
          metaRobots: 'index, follow',
          ogTitle: 'OG Title',
          ogDescription: 'OG Description',
          ogImageKey: 'media/seo/og-image.jpg',
          companyProfileId: profile.id,
        });

      console.log('Company profile created successfully!');
    } else {
      console.log('Company profile already exists, skipping.');
    }

    console.log('\n--- Seeding Permissions ---');
    const permissionsData = [
      { resource: 'blog', action: 'read', key: 'blog.read', description: 'View blogs' },
      { resource: 'blog', action: 'create', key: 'blog.create', description: 'Create new blogs' },
      { resource: 'blog', action: 'edit', key: 'blog.edit', description: 'Edit existing blogs' },
      { resource: 'blog', action: 'delete', key: 'blog.delete', description: 'Delete blogs' },
      
      { resource: 'service', action: 'read', key: 'service.read', description: 'View services' },
      { resource: 'service', action: 'create', key: 'service.create', description: 'Create new services' },
      { resource: 'service', action: 'edit', key: 'service.edit', description: 'Edit existing services' },
      { resource: 'service', action: 'delete', key: 'service.delete', description: 'Delete services' },
      
      { resource: 'testimonial', action: 'read', key: 'testimonial.read', description: 'View testimonials' },
      { resource: 'testimonial', action: 'create', key: 'testimonial.create', description: 'Create new testimonials' },
      { resource: 'testimonial', action: 'edit', key: 'testimonial.edit', description: 'Edit existing testimonials' },
      { resource: 'testimonial', action: 'delete', key: 'testimonial.delete', description: 'Delete testimonials' },
      
      { resource: 'team', action: 'read', key: 'team.read', description: 'View team members' },
      { resource: 'team', action: 'create', key: 'team.create', description: 'Create new team members' },
      { resource: 'team', action: 'edit', key: 'team.edit', description: 'Edit existing team members' },
      { resource: 'team', action: 'delete', key: 'team.delete', description: 'Delete team members' },
      
      { resource: 'faq', action: 'read', key: 'faq.read', description: 'View FAQs' },
      { resource: 'faq', action: 'create', key: 'faq.create', description: 'Create new FAQs' },
      { resource: 'faq', action: 'edit', key: 'faq.edit', description: 'Edit existing FAQs' },
      { resource: 'faq', action: 'delete', key: 'faq.delete', description: 'Delete FAQs' },
      
      { resource: 'user', action: 'read', key: 'user.read', description: 'View users' },
      { resource: 'user', action: 'create', key: 'user.create', description: 'Create new users' },
      { resource: 'user', action: 'edit', key: 'user.edit', description: 'Edit existing users' },
      { resource: 'user', action: 'delete', key: 'user.delete', description: 'Delete users' },
      
      { resource: 'inquiry', action: 'read', key: 'inquiry.read', description: 'View inquiries' },
      { resource: 'inquiry', action: 'delete', key: 'inquiry.delete', description: 'Delete inquiries' },
      
      { resource: 'company_profile', action: 'read', key: 'company_profile.read', description: 'View company profile' },
      { resource: 'company_profile', action: 'edit', key: 'company_profile.edit', description: 'Edit company profile' },
      
      { resource: 'seo', action: 'read', key: 'seo.read', description: 'View SEO settings' },
      { resource: 'seo', action: 'edit', key: 'seo.edit', description: 'Edit SEO settings' },
      
      { resource: 'page_seo', action: 'read', key: 'page_seo.read', description: 'View page SEO' },
      { resource: 'page_seo', action: 'create', key: 'page_seo.create', description: 'Create new page SEO' },
      { resource: 'page_seo', action: 'edit', key: 'page_seo.edit', description: 'Edit existing page SEO' },
      { resource: 'page_seo', action: 'delete', key: 'page_seo.delete', description: 'Delete page SEO' },
      
      { resource: 'redirect', action: 'read', key: 'redirect.read', description: 'View redirects' },
      { resource: 'redirect', action: 'create', key: 'redirect.create', description: 'Create new redirects' },
      { resource: 'redirect', action: 'edit', key: 'redirect.edit', description: 'Edit existing redirects' },
      { resource: 'redirect', action: 'delete', key: 'redirect.delete', description: 'Delete redirects' },
      
      { resource: 'payment_settings', action: 'read', key: 'payment_settings.read', description: 'View payment settings' },
      { resource: 'payment_settings', action: 'edit', key: 'payment_settings.edit', description: 'Edit payment settings' },
      
      { resource: 'domain', action: 'read', key: 'domain.read', description: 'View custom domains' },
      { resource: 'domain', action: 'create', key: 'domain.create', description: 'Create new custom domains' },
      { resource: 'domain', action: 'edit', key: 'domain.edit', description: 'Edit existing custom domains' },
      { resource: 'domain', action: 'delete', key: 'domain.delete', description: 'Delete custom domains' },
      
      { resource: 'permission', action: 'read', key: 'permission.read', description: 'View permissions and roles' },
      { resource: 'permission', action: 'edit', key: 'permission.edit', description: 'Edit role permissions' },
      
      { resource: 'dashboard', action: 'view_stats', key: 'dashboard.view_stats', description: 'View dashboard statistics' },
    ];

    for (const perm of permissionsData) {
      const existing = await db
        .select()
        .from(schema.permissions)
        .where(eq(schema.permissions.key, perm.key))
        .limit(1);
      
      if (existing.length === 0) {
        await db.insert(schema.permissions).values(perm);
        console.log(`✓ Created permission: ${perm.key}`);
      }
    }

    console.log('\n--- Seeding Role Permissions ---');
    
    const allPermissions = await db.select().from(schema.permissions);
    const permissionMap = new Map(allPermissions.map(p => [p.key, p.id]));

    const rolePermissionsData = [
      { role: 'admin', permissions: [
        'blog.read', 'blog.create', 'blog.edit', 'blog.delete',
        'service.read', 'service.create', 'service.edit', 'service.delete',
        'testimonial.read', 'testimonial.create', 'testimonial.edit', 'testimonial.delete',
        'team.read', 'team.create', 'team.edit', 'team.delete',
        'faq.read', 'faq.create', 'faq.edit', 'faq.delete',
        'user.read', 'user.create',
        'inquiry.read', 'inquiry.delete',
        'company_profile.read', 'company_profile.edit',
        'seo.read', 'seo.edit',
        'page_seo.read', 'page_seo.create', 'page_seo.edit', 'page_seo.delete',
        'redirect.read', 'redirect.create', 'redirect.edit', 'redirect.delete',
        'payment_settings.read',
        'domain.read', 'domain.create', 'domain.edit', 'domain.delete',
        'permission.read', 'permission.edit',
        'dashboard.view_stats',
      ]},
      { role: 'editor', permissions: [
        'blog.read', 'blog.create', 'blog.edit', 'blog.delete',
        'service.read', 'service.create', 'service.edit', 'service.delete',
        'testimonial.read', 'testimonial.create', 'testimonial.edit', 'testimonial.delete',
        'team.read', 'team.create', 'team.edit', 'team.delete',
        'faq.read', 'faq.create', 'faq.edit', 'faq.delete',
        'inquiry.read',
        'dashboard.view_stats',
      ]},
      { role: 'manager', permissions: [
        'blog.read',
        'service.read',
        'testimonial.read',
        'team.read',
        'faq.read',
        'inquiry.read',
        'dashboard.view_stats',
      ]},
    ];

    for (const { role, permissions } of rolePermissionsData) {
      await db.delete(schema.rolePermissions).where(eq(schema.rolePermissions.role, role));
      
      for (const permKey of permissions) {
        const permId = permissionMap.get(permKey);
        if (permId) {
          await db.insert(schema.rolePermissions).values({
            role,
            permissionId: permId,
          });
        }
      }
      console.log(`✓ Assigned ${permissions.length} permissions to role: ${role}`);
    }

    console.log('\n✅ All permissions seeded successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed();
