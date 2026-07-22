import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as bcrypt from 'bcryptjs';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { eq } from 'drizzle-orm';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  try {
    // Seed admin user
    const existingAdmin = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, 'admin@page.com'))
      .limit(1);

    if (existingAdmin.length === 0) {
      const passwordHash = await bcrypt.hash('Admin@123', 10);

      await db
        .insert(schema.users)
        .values({
          email: 'admin@page.com',
          passwordHash,
          firstName: 'Super',
          lastName: 'Admin',
          role: 'super_admin',
          isActive: true,
          isEmailVerified: true,
        });

      console.log('Super admin created successfully!');
      console.log('Email: admin@page.com');
      console.log('Password: Admin@123');
    } else {
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
          socialMedia: [
            {
              platform: 'Facebook',
              url: 'https://facebook.com/mycompany',
              order: 0,
            },
          ],
          isActive: true,
        })
        .returning();

      await db
        .insert(schema.seoMetas)
        .values({
          metaTitle: 'My Awesome Page Title',
          metaDescription: 'This is a description of my awesome page.',
          metaKeywords: ['keyword1', 'keyword2'],
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
