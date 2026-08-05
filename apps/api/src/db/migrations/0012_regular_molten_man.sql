CREATE TABLE "navigation_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(50) NOT NULL,
	"label" varchar(100) NOT NULL,
	"path" varchar(255) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "navigation_items_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE INDEX "navigation_items_key_idx" ON "navigation_items" USING btree ("key");--> statement-breakpoint
CREATE INDEX "navigation_items_sort_order_idx" ON "navigation_items" USING btree ("sort_order");