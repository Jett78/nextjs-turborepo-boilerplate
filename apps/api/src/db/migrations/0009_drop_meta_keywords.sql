-- Migration: Drop meta_keywords columns from seo_metas and global_seo tables
-- This permanently removes the meta keywords field as it is no longer used for SEO

ALTER TABLE "seo_metas" DROP COLUMN IF EXISTS "meta_keywords";

ALTER TABLE "global_seo" DROP COLUMN IF EXISTS "meta_keywords";
