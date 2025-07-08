import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_main_navigation_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__main_navigation_v_version_items_children_subchildren_type" AS ENUM('page', 'external');
  CREATE TYPE "public"."enum__main_navigation_v_version_items_children_type" AS ENUM('page', 'external');
  CREATE TYPE "public"."enum__main_navigation_v_version_items_type" AS ENUM('page', 'external');
  CREATE TYPE "public"."enum__main_navigation_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__main_navigation_v_published_locale" AS ENUM('fi', 'en');
  CREATE TABLE "main_navigation_items_children_subchildren_locales" (
  	"label" varchar,
  	"url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "main_navigation_items_children_locales" (
  	"label" varchar,
  	"url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "main_navigation_items_locales" (
  	"label" varchar,
  	"url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_main_navigation_v_version_items_children_subchildren" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__main_navigation_v_version_items_children_subchildren_type" DEFAULT 'page',
  	"page_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_main_navigation_v_version_items_children_subchildren_locales" (
  	"label" varchar,
  	"url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_main_navigation_v_version_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__main_navigation_v_version_items_children_type" DEFAULT 'page',
  	"page_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_main_navigation_v_version_items_children_locales" (
  	"label" varchar,
  	"url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_main_navigation_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__main_navigation_v_version_items_type" DEFAULT 'page',
  	"page_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_main_navigation_v_version_items_locales" (
  	"label" varchar,
  	"url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_main_navigation_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_logo_id" integer,
  	"version__status" "enum__main_navigation_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__main_navigation_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_main_navigation_v_locales" (
  	"version_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP INDEX "main_navigation_items_children_subchildren_locale_idx";
  DROP INDEX "main_navigation_items_children_locale_idx";
  DROP INDEX "main_navigation_items_locale_idx";
  DROP INDEX "redirects_from_idx";
  ALTER TABLE "main_navigation_items_children_subchildren" ALTER COLUMN "type" DROP NOT NULL;
  ALTER TABLE "main_navigation_items_children" ALTER COLUMN "type" DROP NOT NULL;
  ALTER TABLE "main_navigation_items" ALTER COLUMN "type" DROP NOT NULL;
  ALTER TABLE "main_navigation" ALTER COLUMN "logo_id" DROP NOT NULL;
  ALTER TABLE "main_navigation_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "main_navigation" ADD COLUMN "_status" "enum_main_navigation_status" DEFAULT 'draft';
  ALTER TABLE "landing_page" ADD COLUMN "announcement_enabled" boolean DEFAULT false;
  ALTER TABLE "_landing_page_v" ADD COLUMN "version_announcement_enabled" boolean DEFAULT false;
  ALTER TABLE "main_navigation_items_children_subchildren_locales" ADD CONSTRAINT "main_navigation_items_children_subchildren_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation_items_children_subchildren"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_navigation_items_children_locales" ADD CONSTRAINT "main_navigation_items_children_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation_items_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_navigation_items_locales" ADD CONSTRAINT "main_navigation_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren" ADD CONSTRAINT "_main_navigation_v_version_items_children_subchildren_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren" ADD CONSTRAINT "_main_navigation_v_version_items_children_subchildren_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_main_navigation_v_version_items_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren_locales" ADD CONSTRAINT "_main_navigation_v_version_items_children_subchildren_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_main_navigation_v_version_items_children_subchildren"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items_children" ADD CONSTRAINT "_main_navigation_v_version_items_children_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items_children" ADD CONSTRAINT "_main_navigation_v_version_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_main_navigation_v_version_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items_children_locales" ADD CONSTRAINT "_main_navigation_v_version_items_children_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_main_navigation_v_version_items_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items" ADD CONSTRAINT "_main_navigation_v_version_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items" ADD CONSTRAINT "_main_navigation_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_main_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items_locales" ADD CONSTRAINT "_main_navigation_v_version_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_main_navigation_v_version_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_main_navigation_v" ADD CONSTRAINT "_main_navigation_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_locales" ADD CONSTRAINT "_main_navigation_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_main_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "main_navigation_items_children_subchildren_locales_locale_parent_id_unique" ON "main_navigation_items_children_subchildren_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "main_navigation_items_children_locales_locale_parent_id_unique" ON "main_navigation_items_children_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "main_navigation_items_locales_locale_parent_id_unique" ON "main_navigation_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_main_navigation_v_version_items_children_subchildren_order_idx" ON "_main_navigation_v_version_items_children_subchildren" USING btree ("_order");
  CREATE INDEX "_main_navigation_v_version_items_children_subchildren_parent_id_idx" ON "_main_navigation_v_version_items_children_subchildren" USING btree ("_parent_id");
  CREATE INDEX "_main_navigation_v_version_items_children_subchildren_page_idx" ON "_main_navigation_v_version_items_children_subchildren" USING btree ("page_id");
  CREATE UNIQUE INDEX "_main_navigation_v_version_items_children_subchildren_locales_locale_parent_id_unique" ON "_main_navigation_v_version_items_children_subchildren_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_main_navigation_v_version_items_children_order_idx" ON "_main_navigation_v_version_items_children" USING btree ("_order");
  CREATE INDEX "_main_navigation_v_version_items_children_parent_id_idx" ON "_main_navigation_v_version_items_children" USING btree ("_parent_id");
  CREATE INDEX "_main_navigation_v_version_items_children_page_idx" ON "_main_navigation_v_version_items_children" USING btree ("page_id");
  CREATE UNIQUE INDEX "_main_navigation_v_version_items_children_locales_locale_parent_id_unique" ON "_main_navigation_v_version_items_children_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_main_navigation_v_version_items_order_idx" ON "_main_navigation_v_version_items" USING btree ("_order");
  CREATE INDEX "_main_navigation_v_version_items_parent_id_idx" ON "_main_navigation_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_main_navigation_v_version_items_page_idx" ON "_main_navigation_v_version_items" USING btree ("page_id");
  CREATE UNIQUE INDEX "_main_navigation_v_version_items_locales_locale_parent_id_unique" ON "_main_navigation_v_version_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_main_navigation_v_version_version_logo_idx" ON "_main_navigation_v" USING btree ("version_logo_id");
  CREATE INDEX "_main_navigation_v_version_version__status_idx" ON "_main_navigation_v" USING btree ("version__status");
  CREATE INDEX "_main_navigation_v_created_at_idx" ON "_main_navigation_v" USING btree ("created_at");
  CREATE INDEX "_main_navigation_v_updated_at_idx" ON "_main_navigation_v" USING btree ("updated_at");
  CREATE INDEX "_main_navigation_v_snapshot_idx" ON "_main_navigation_v" USING btree ("snapshot");
  CREATE INDEX "_main_navigation_v_published_locale_idx" ON "_main_navigation_v" USING btree ("published_locale");
  CREATE INDEX "_main_navigation_v_latest_idx" ON "_main_navigation_v" USING btree ("latest");
  CREATE INDEX "_main_navigation_v_autosave_idx" ON "_main_navigation_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_main_navigation_v_locales_locale_parent_id_unique" ON "_main_navigation_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "main_navigation__status_idx" ON "main_navigation" USING btree ("_status");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  ALTER TABLE "main_navigation_items_children_subchildren" DROP COLUMN "_locale";
  ALTER TABLE "main_navigation_items_children_subchildren" DROP COLUMN "label";
  ALTER TABLE "main_navigation_items_children_subchildren" DROP COLUMN "url";
  ALTER TABLE "main_navigation_items_children" DROP COLUMN "_locale";
  ALTER TABLE "main_navigation_items_children" DROP COLUMN "label";
  ALTER TABLE "main_navigation_items_children" DROP COLUMN "url";
  ALTER TABLE "main_navigation_items" DROP COLUMN "_locale";
  ALTER TABLE "main_navigation_items" DROP COLUMN "label";
  ALTER TABLE "main_navigation_items" DROP COLUMN "url";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "main_navigation_items_children_subchildren_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "main_navigation_items_children_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "main_navigation_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_main_navigation_v_version_items_children" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_main_navigation_v_version_items_children_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_main_navigation_v_version_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_main_navigation_v_version_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_main_navigation_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_main_navigation_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "main_navigation_items_children_subchildren_locales" CASCADE;
  DROP TABLE "main_navigation_items_children_locales" CASCADE;
  DROP TABLE "main_navigation_items_locales" CASCADE;
  DROP TABLE "_main_navigation_v_version_items_children_subchildren" CASCADE;
  DROP TABLE "_main_navigation_v_version_items_children_subchildren_locales" CASCADE;
  DROP TABLE "_main_navigation_v_version_items_children" CASCADE;
  DROP TABLE "_main_navigation_v_version_items_children_locales" CASCADE;
  DROP TABLE "_main_navigation_v_version_items" CASCADE;
  DROP TABLE "_main_navigation_v_version_items_locales" CASCADE;
  DROP TABLE "_main_navigation_v" CASCADE;
  DROP TABLE "_main_navigation_v_locales" CASCADE;
  DROP INDEX "main_navigation__status_idx";
  DROP INDEX "redirects_from_idx";
  ALTER TABLE "main_navigation_items_children_subchildren" ALTER COLUMN "type" SET NOT NULL;
  ALTER TABLE "main_navigation_items_children" ALTER COLUMN "type" SET NOT NULL;
  ALTER TABLE "main_navigation_items" ALTER COLUMN "type" SET NOT NULL;
  ALTER TABLE "main_navigation" ALTER COLUMN "logo_id" SET NOT NULL;
  ALTER TABLE "main_navigation_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "main_navigation_items_children_subchildren" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "main_navigation_items_children_subchildren" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "main_navigation_items_children_subchildren" ADD COLUMN "url" varchar;
  ALTER TABLE "main_navigation_items_children" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "main_navigation_items_children" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "main_navigation_items_children" ADD COLUMN "url" varchar;
  ALTER TABLE "main_navigation_items" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "main_navigation_items" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "main_navigation_items" ADD COLUMN "url" varchar;
  CREATE INDEX "main_navigation_items_children_subchildren_locale_idx" ON "main_navigation_items_children_subchildren" USING btree ("_locale");
  CREATE INDEX "main_navigation_items_children_locale_idx" ON "main_navigation_items_children" USING btree ("_locale");
  CREATE INDEX "main_navigation_items_locale_idx" ON "main_navigation_items" USING btree ("_locale");
  CREATE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  ALTER TABLE "main_navigation" DROP COLUMN "_status";
  ALTER TABLE "landing_page" DROP COLUMN "announcement_enabled";
  ALTER TABLE "_landing_page_v" DROP COLUMN "version_announcement_enabled";
  DROP TYPE "public"."enum_main_navigation_status";
  DROP TYPE "public"."enum__main_navigation_v_version_items_children_subchildren_type";
  DROP TYPE "public"."enum__main_navigation_v_version_items_children_type";
  DROP TYPE "public"."enum__main_navigation_v_version_items_type";
  DROP TYPE "public"."enum__main_navigation_v_version_status";
  DROP TYPE "public"."enum__main_navigation_v_published_locale";`)
}
