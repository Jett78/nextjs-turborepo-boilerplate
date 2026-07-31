-- Add social media URL columns to company_profiles
ALTER TABLE "company_profiles" ADD COLUMN "facebook_url" varchar(500);
ALTER TABLE "company_profiles" ADD COLUMN "instagram_url" varchar(500);
ALTER TABLE "company_profiles" ADD COLUMN "tiktok_url" varchar(500);
ALTER TABLE "company_profiles" ADD COLUMN "twitter_url" varchar(500);
