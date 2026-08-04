CREATE TABLE "redirects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_path" varchar(500) NOT NULL,
	"to_path" varchar(500) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "redirects_from_path_unique" UNIQUE("from_path")
);
--> statement-breakpoint
ALTER TABLE "company_profiles" ADD COLUMN "text_foreground" varchar(50);--> statement-breakpoint
CREATE INDEX "redirects_from_path_idx" ON "redirects" USING btree ("from_path");--> statement-breakpoint
CREATE INDEX "redirects_is_active_idx" ON "redirects" USING btree ("is_active");--> statement-breakpoint
ALTER TABLE "global_seo" DROP COLUMN "meta_keywords";--> statement-breakpoint
ALTER TABLE "seo_metas" DROP COLUMN "meta_keywords";