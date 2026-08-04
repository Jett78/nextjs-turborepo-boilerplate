-- Migration: Add status_code column to redirects table

ALTER TABLE "redirects" ADD COLUMN "status_code" integer DEFAULT 301 NOT NULL;
