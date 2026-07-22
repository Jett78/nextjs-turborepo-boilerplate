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
    const existingAdmin = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, 'admin@page.com'))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('Super admin already exists, skipping seed.');
      return;
    }

    const passwordHash = await bcrypt.hash('Admin@123', 10);

    const [admin] = await db
      .insert(schema.users)
      .values({
        email: 'admin@page.com',
        passwordHash,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'super_admin',
        isActive: true,
        isEmailVerified: true,
      })
      .returning();

    console.log('Super admin created successfully!');
    console.log('Email: admin@page.com');
    console.log('Password: Admin@123');
    console.log('Role:', admin.role);
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed();