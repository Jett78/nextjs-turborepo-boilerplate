CREATE TYPE "public"."auth_provider" AS ENUM('email', 'google', 'github');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'admin', 'manager', 'customer');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"password" text,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"id_token_claims" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" varchar(500) NOT NULL,
	"answer" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "global_seo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meta_title" varchar(255),
	"meta_description" text,
	"meta_keywords" text[],
	"og_title" varchar(255),
	"og_description" text,
	"og_image_key" varchar(500),
	"gtm_container_id" varchar(100),
	"google_search_console_verification" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_seo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_path" varchar(500) NOT NULL,
	"page_title" varchar(255),
	"meta_title" varchar(255),
	"meta_description" text,
	"og_title" varchar(255),
	"og_description" text,
	"og_image_key" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "page_seo_page_path_unique" UNIQUE("page_path")
);
--> statement-breakpoint
CREATE TABLE "payment_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" varchar(50) NOT NULL,
	"secret_key" text NOT NULL,
	"public_key" text NOT NULL,
	"api_url" varchar(500) NOT NULL,
	"environment" varchar(20) DEFAULT 'sandbox' NOT NULL,
	"is_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_settings_provider_unique" UNIQUE("provider")
);
--> statement-breakpoint
CREATE TABLE "seo_metas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meta_title" varchar(255),
	"meta_description" text,
	"meta_keywords" text[],
	"canonical_url" varchar(500),
	"meta_robots" varchar(100) DEFAULT 'index, follow',
	"og_title" varchar(255),
	"og_description" text,
	"og_image_key" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"blog_id" uuid,
	"company_profile_id" uuid
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"avatar" varchar(500),
	"designation" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" varchar(50) DEFAULT 'customer' NOT NULL,
	"phone" varchar(20),
	"address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "company_profiles" DROP CONSTRAINT "company_profiles_slug_unique";--> statement-breakpoint
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_company_id_company_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "company_profiles" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "company_profiles" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "company_profiles" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "company_profiles" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "company_profiles" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "company_profiles" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "image_key" varchar(500);--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "company_profiles" ADD COLUMN "company_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "company_profiles" ADD COLUMN "company_description" text;--> statement-breakpoint
ALTER TABLE "company_profiles" ADD COLUMN "phone_number" varchar(50);--> statement-breakpoint
ALTER TABLE "company_profiles" ADD COLUMN "logo_key" varchar(500);--> statement-breakpoint
ALTER TABLE "company_profiles" ADD COLUMN "footer_logo_key" varchar(500);--> statement-breakpoint
ALTER TABLE "company_profiles" ADD COLUMN "favicon_key" varchar(500);--> statement-breakpoint
ALTER TABLE "company_profiles" ADD COLUMN "whatsapp_number" varchar(50);--> statement-breakpoint
ALTER TABLE "company_profiles" ADD COLUMN "google_map" text;--> statement-breakpoint
ALTER TABLE "company_profiles" ADD COLUMN "primary_color" varchar(50);--> statement-breakpoint
ALTER TABLE "company_profiles" ADD COLUMN "secondary_color" varchar(50);--> statement-breakpoint
ALTER TABLE "company_profiles" ADD COLUMN "facebook_url" varchar(500);--> statement-breakpoint
ALTER TABLE "company_profiles" ADD COLUMN "instagram_url" varchar(500);--> statement-breakpoint
ALTER TABLE "company_profiles" ADD COLUMN "tiktok_url" varchar(500);--> statement-breakpoint
ALTER TABLE "company_profiles" ADD COLUMN "twitter_url" varchar(500);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_hash" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image_key" varchar(500);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'super_admin' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider" "auth_provider" DEFAULT 'email' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider_data" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_email_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_phone_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seo_metas" ADD CONSTRAINT "seo_metas_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seo_metas" ADD CONSTRAINT "seo_metas_company_profile_id_company_profiles_id_fk" FOREIGN KEY ("company_profile_id") REFERENCES "public"."company_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "faqs_sort_order_idx" ON "faqs" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "page_seo_page_path_idx" ON "page_seo" USING btree ("page_path");--> statement-breakpoint
CREATE INDEX "testimonials_sort_order_idx" ON "testimonials" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "blogs_slug_idx" ON "blogs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_phone_idx" ON "users" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "users_is_active_idx" ON "users" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
ALTER TABLE "blogs" DROP COLUMN "content";--> statement-breakpoint
ALTER TABLE "blogs" DROP COLUMN "excerpt";--> statement-breakpoint
ALTER TABLE "blogs" DROP COLUMN "cover_image";--> statement-breakpoint
ALTER TABLE "blogs" DROP COLUMN "author_id";--> statement-breakpoint
ALTER TABLE "blogs" DROP COLUMN "company_id";--> statement-breakpoint
ALTER TABLE "blogs" DROP COLUMN "is_published";--> statement-breakpoint
ALTER TABLE "blogs" DROP COLUMN "published_at";--> statement-breakpoint
ALTER TABLE "blogs" DROP COLUMN "tags";--> statement-breakpoint
ALTER TABLE "blogs" DROP COLUMN "view_count";--> statement-breakpoint
ALTER TABLE "company_profiles" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "company_profiles" DROP COLUMN "slug";--> statement-breakpoint
ALTER TABLE "company_profiles" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "company_profiles" DROP COLUMN "website";--> statement-breakpoint
ALTER TABLE "company_profiles" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "company_profiles" DROP COLUMN "logo";--> statement-breakpoint
ALTER TABLE "company_profiles" DROP COLUMN "founded";--> statement-breakpoint
ALTER TABLE "company_profiles" DROP COLUMN "industry";--> statement-breakpoint
ALTER TABLE "company_profiles" DROP COLUMN "employee_count";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_phone_unique" UNIQUE("phone");