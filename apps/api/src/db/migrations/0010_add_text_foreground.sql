-- Migration: Add text_foreground column to company_profiles table

ALTER TABLE "company_profiles" ADD COLUMN "text_foreground" varchar(50);
