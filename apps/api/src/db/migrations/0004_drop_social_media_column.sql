-- Drop the social_media jsonb column (replaced by dedicated URL columns)
ALTER TABLE "company_profiles" DROP COLUMN IF EXISTS "social_media";
