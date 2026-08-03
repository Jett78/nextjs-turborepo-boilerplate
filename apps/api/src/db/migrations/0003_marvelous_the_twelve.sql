CREATE TYPE "public"."deployment_status" AS ENUM('pending', 'deploying', 'deployed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."domain_status" AS ENUM('pending', 'verifying', 'verified', 'active', 'failed');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'completed', 'failed', 'refunded', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."ssl_status" AS ENUM('pending', 'active', 'failed', 'none');--> statement-breakpoint
CREATE TABLE "custom_domains" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain" varchar(255) NOT NULL,
	"status" "domain_status" DEFAULT 'pending' NOT NULL,
	"verified_at" timestamp with time zone,
	"ssl_status" "ssl_status" DEFAULT 'none' NOT NULL,
	"ssl_issued_at" timestamp with time zone,
	"deployment_status" "deployment_status" DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"dns_records_checked" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "custom_domains_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" varchar(255) NOT NULL,
	"pidx" varchar(255),
	"user_id" text,
	"product_name" varchar(255) NOT NULL,
	"product_id" varchar(255) NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'NPR' NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"payment_method" varchar(50),
	"transaction_id" varchar(255),
	"customer_name" varchar(255),
	"customer_email" varchar(255),
	"customer_phone" varchar(50),
	"metadata" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "custom_domains_domain_idx" ON "custom_domains" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "custom_domains_status_idx" ON "custom_domains" USING btree ("status");--> statement-breakpoint
CREATE INDEX "orders_order_id_idx" ON "orders" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "orders_pidx_idx" ON "orders" USING btree ("pidx");--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
ALTER TABLE "payment_settings" DROP COLUMN "environment";