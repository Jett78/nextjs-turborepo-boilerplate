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
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed();
