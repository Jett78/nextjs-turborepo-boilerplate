CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"designation" varchar(255),
	"joined_date" timestamp with time zone,
	"message" text,
	"avatar" varchar(500),
	"whatsapp_url" varchar(500),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "custom_domains" ADD COLUMN "dokploy_domain_id" varchar(255);--> statement-breakpoint
CREATE INDEX "team_members_sort_order_idx" ON "team_members" USING btree ("sort_order");