import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "documents" ADD COLUMN "folder_id" integer;
  ALTER TABLE "media" ADD COLUMN "folder_id" integer;
  ALTER TABLE "pages" ADD COLUMN "folder_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_folder_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "folders_id" integer;
  DO $$ BEGIN
   ALTER TABLE "folders" ADD CONSTRAINT "folders_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "folders_name_idx" ON "folders" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "folders_folder_idx" ON "folders" USING btree ("folder_id");
  CREATE INDEX IF NOT EXISTS "folders_updated_at_idx" ON "folders" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "folders_created_at_idx" ON "folders" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "documents" ADD CONSTRAINT "documents_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages" ADD CONSTRAINT "pages_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_folder_id_folders_id_fk" FOREIGN KEY ("version_folder_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_folders_fk" FOREIGN KEY ("folders_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "documents_folder_idx" ON "documents" USING btree ("folder_id");
  CREATE INDEX IF NOT EXISTS "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX IF NOT EXISTS "pages_folder_idx" ON "pages" USING btree ("folder_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_folder_idx" ON "_pages_v" USING btree ("version_folder_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("folders_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "folders" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "folders" CASCADE;
  ALTER TABLE "documents" DROP CONSTRAINT "documents_folder_id_folders_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT "media_folder_id_folders_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_folder_id_folders_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_folder_id_folders_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_folders_fk";
  
  DROP INDEX IF EXISTS "documents_folder_idx";
  DROP INDEX IF EXISTS "media_folder_idx";
  DROP INDEX IF EXISTS "pages_folder_idx";
  DROP INDEX IF EXISTS "_pages_v_version_version_folder_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_folders_id_idx";
  ALTER TABLE "documents" DROP COLUMN IF EXISTS "folder_id";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "folder_id";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "folder_id";
  ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_folder_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "folders_id";`)
}
