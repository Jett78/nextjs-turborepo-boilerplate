ALTER TABLE "team_members" ADD COLUMN "slug" varchar(500) NOT NULL;--> statement-breakpoint
CREATE INDEX "team_members_slug_idx" ON "team_members" USING btree ("slug");--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_slug_unique" UNIQUE("slug");