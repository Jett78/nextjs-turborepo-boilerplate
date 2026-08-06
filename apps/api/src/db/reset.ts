import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const tables = [
  'role_permissions',
  'navigation_items',
  'redirects',
  'custom_domains',
  'orders',
  'payment_settings',
  'messages',
  'faqs',
  'gallery',
  'services',
  'team_members',
  'testimonials',
  'page_seo',
  'global_seo',
  'seo_metas',
  'blogs',
  'company_profiles',
  'permissions',
  'verification',
  'account',
  'session',
  'user',
];

async function reset() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('🗑️  Dropping all tables...\n');

    for (const table of tables) {
      await pool.query(`TRUNCATE TABLE "${table}" CASCADE`);
      console.log(`  ✓ Truncated ${table}`);
    }

    console.log('\n✅ All tables truncated successfully!');
  } catch (error) {
    console.error('❌ Reset failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

reset();
