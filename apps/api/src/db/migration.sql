-- Migration: Merge company_profile_seo_metas into seo_metas
-- Step 1: Add company_profile_id column to seo_metas
ALTER TABLE seo_metas ADD COLUMN company_profile_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE;

-- Step 2: Migrate existing data from company_profile_seo_metas to seo_metas
INSERT INTO seo_metas (meta_title, meta_description, meta_keywords, canonical_url, meta_robots, og_title, og_description, og_image_key, created_at, updated_at, company_profile_id)
SELECT meta_title, meta_description, meta_keywords, canonical_url, meta_robots, og_title, og_description, og_image_key, created_at, updated_at, company_profile_id
FROM company_profile_seo_metas;

-- Step 3: Drop the old table
DROP TABLE company_profile_seo_metas;
