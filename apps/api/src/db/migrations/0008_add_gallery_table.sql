CREATE TYPE "public"."gallery_category" AS ENUM('portfolio', 'team', 'events', 'behind_the_scenes', 'testimonials', 'other');--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"description" text,
	"images" text[] NOT NULL,
	"category" "gallery_category" DEFAULT 'other' NOT NULL,
	"tags" text[],
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "gallery_slug_idx" ON "gallery" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "gallery_category_idx" ON "gallery" USING btree ("category");--> statement-breakpoint
CREATE INDEX "gallery_sort_order_idx" ON "gallery" USING btree ("sort_order");