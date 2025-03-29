DO $$ BEGIN
 CREATE TYPE "public"."comment_tag" AS ENUM('beta', 'update', 'warning', 'question', 'gear');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."difficulty_option" AS ENUM('sandbag', 'staunch', 'stiff', 'fair', 'easy', 'overgraded');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('admin', 'user', 'manager');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."route_style" AS ENUM('trad', 'sport', 'solo', 'bouldering', 'mixed', 'aid');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morgan-bay-climbing_comment_tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"comment_id" integer NOT NULL,
	"tag" "comment_tag" NOT NULL,
	CONSTRAINT "unique_comment_tag" UNIQUE("comment_id","tag")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morgan-bay-climbing_comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morgan-bay-climbing_headland" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "morgan-bay-climbing_headland_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morgan-bay-climbing_route_difficulty_vote" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"difficulty_option" "difficulty_option" NOT NULL,
	CONSTRAINT "unique_difficulty_vote" UNIQUE("route_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morgan-bay-climbing_route_tag_vote" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_id" integer NOT NULL,
	"tag_id" varchar(255) NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "unique_vote" UNIQUE("route_id","tag_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morgan-bay-climbing_route" (
	"id" serial PRIMARY KEY NOT NULL,
	"sector_id" integer NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"route_number" integer,
	"grade" integer,
	"stars" integer,
	"description" text NOT NULL,
	"first_ascent" varchar(255),
	"date" timestamp,
	"info" varchar(255),
	"route_style" "route_style",
	CONSTRAINT "morgan-bay-climbing_route_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morgan-bay-climbing_sector" (
	"id" serial PRIMARY KEY NOT NULL,
	"headland_id" integer NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "morgan-bay-climbing_sector_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morgan-bay-climbing_tag" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "morgan-bay-climbing_tag_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morgan-bay-climbing_user" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"role" "role" NOT NULL,
	"preferences" json
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morgan-bay-climbing_comment_tag" ADD CONSTRAINT "morgan-bay-climbing_comment_tag_comment_id_morgan-bay-climbing_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."morgan-bay-climbing_comment"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morgan-bay-climbing_comment" ADD CONSTRAINT "morgan-bay-climbing_comment_route_id_morgan-bay-climbing_route_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."morgan-bay-climbing_route"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morgan-bay-climbing_route_difficulty_vote" ADD CONSTRAINT "morgan-bay-climbing_route_difficulty_vote_route_id_morgan-bay-climbing_route_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."morgan-bay-climbing_route"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morgan-bay-climbing_route_difficulty_vote" ADD CONSTRAINT "morgan-bay-climbing_route_difficulty_vote_user_id_morgan-bay-climbing_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."morgan-bay-climbing_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morgan-bay-climbing_route_tag_vote" ADD CONSTRAINT "morgan-bay-climbing_route_tag_vote_route_id_morgan-bay-climbing_route_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."morgan-bay-climbing_route"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morgan-bay-climbing_route_tag_vote" ADD CONSTRAINT "morgan-bay-climbing_route_tag_vote_tag_id_morgan-bay-climbing_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."morgan-bay-climbing_tag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morgan-bay-climbing_route_tag_vote" ADD CONSTRAINT "morgan-bay-climbing_route_tag_vote_user_id_morgan-bay-climbing_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."morgan-bay-climbing_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morgan-bay-climbing_route" ADD CONSTRAINT "morgan-bay-climbing_route_sector_id_morgan-bay-climbing_sector_id_fk" FOREIGN KEY ("sector_id") REFERENCES "public"."morgan-bay-climbing_sector"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morgan-bay-climbing_sector" ADD CONSTRAINT "morgan-bay-climbing_sector_headland_id_morgan-bay-climbing_headland_id_fk" FOREIGN KEY ("headland_id") REFERENCES "public"."morgan-bay-climbing_headland"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comment_id_idx" ON "morgan-bay-climbing_comment_tag" USING btree ("comment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "route_id_idx" ON "morgan-bay-climbing_comment" USING btree ("route_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comments_user_id_idx" ON "morgan-bay-climbing_comment" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "route_difficulty_votes_route_id_idx" ON "morgan-bay-climbing_route_difficulty_vote" USING btree ("route_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "route_difficulty_user_id_idx" ON "morgan-bay-climbing_route_difficulty_vote" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "route_tag_votes_route_id_idx" ON "morgan-bay-climbing_route_tag_vote" USING btree ("route_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tag_id_idx" ON "morgan-bay-climbing_route_tag_vote" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "route_tag_votes_user_id_idx" ON "morgan-bay-climbing_route_tag_vote" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sector_id_idx" ON "morgan-bay-climbing_route" USING btree ("sector_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "headland_id_idx" ON "morgan-bay-climbing_sector" USING btree ("headland_id");