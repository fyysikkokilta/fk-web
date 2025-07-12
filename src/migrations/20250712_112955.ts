import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_exports_selection_to_use" AS ENUM('currentSelection', 'currentFilters', 'all');
  CREATE TABLE "divisions_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "official_roles_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "translations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "translations_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "translations" CASCADE;
  DROP TABLE "translations_locales" CASCADE;
  ALTER TABLE "divisions" DROP CONSTRAINT "divisions_name_id_translations_id_fk";
  
  ALTER TABLE "official_roles" DROP CONSTRAINT "official_roles_name_id_translations_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_translations_fk";
  
  DROP INDEX "divisions_name_idx";
  DROP INDEX "official_roles_name_idx";
  DROP INDEX "payload_locked_documents_rels_translations_id_idx";
  ALTER TABLE "exports" ADD COLUMN "selection_to_use" "enum_exports_selection_to_use";
  ALTER TABLE "divisions_locales" ADD CONSTRAINT "divisions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "official_roles_locales" ADD CONSTRAINT "official_roles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."official_roles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "divisions_locales_locale_parent_id_unique" ON "divisions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "official_roles_locales_locale_parent_id_unique" ON "official_roles_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "divisions" DROP COLUMN "name_id";
  ALTER TABLE "official_roles" DROP COLUMN "name_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "translations_id";
  DROP TYPE "public"."enum_translations_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_translations_type" AS ENUM('division', 'officialRole');
  CREATE TABLE "translations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_translations_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "translations_locales" (
  	"translation" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "divisions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "official_roles_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "divisions_locales" CASCADE;
  DROP TABLE "official_roles_locales" CASCADE;
  ALTER TABLE "divisions" ADD COLUMN "name_id" integer NOT NULL;
  ALTER TABLE "official_roles" ADD COLUMN "name_id" integer NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "translations_id" integer;
  ALTER TABLE "translations_locales" ADD CONSTRAINT "translations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."translations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "translations_updated_at_idx" ON "translations" USING btree ("updated_at");
  CREATE INDEX "translations_created_at_idx" ON "translations" USING btree ("created_at");
  CREATE UNIQUE INDEX "translations_locales_locale_parent_id_unique" ON "translations_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "divisions" ADD CONSTRAINT "divisions_name_id_translations_id_fk" FOREIGN KEY ("name_id") REFERENCES "public"."translations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "official_roles" ADD CONSTRAINT "official_roles_name_id_translations_id_fk" FOREIGN KEY ("name_id") REFERENCES "public"."translations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_translations_fk" FOREIGN KEY ("translations_id") REFERENCES "public"."translations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "divisions_name_idx" ON "divisions" USING btree ("name_id");
  CREATE INDEX "official_roles_name_idx" ON "official_roles" USING btree ("name_id");
  CREATE INDEX "payload_locked_documents_rels_translations_id_idx" ON "payload_locked_documents_rels" USING btree ("translations_id");
  ALTER TABLE "exports" DROP COLUMN "selection_to_use";
  DROP TYPE "public"."enum_exports_selection_to_use";`)
}
