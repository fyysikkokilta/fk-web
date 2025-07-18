import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "folders_folder_type" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "folders" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "folders_folder_type" CASCADE;
  DROP TABLE "folders" CASCADE;
  ALTER TABLE "documents" DROP CONSTRAINT IF EXISTS "documents_folder_id_folders_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT IF EXISTS "media_folder_id_folders_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_folder_id_folders_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT IF EXISTS "_pages_v_version_folder_id_folders_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_folders_fk";
  
  DROP INDEX "documents_folder_idx";
  DROP INDEX "media_folder_idx";
  DROP INDEX "pages_folder_idx";
  DROP INDEX "_pages_v_version_version_folder_idx";
  DROP INDEX "payload_locked_documents_rels_folders_id_idx";
  ALTER TABLE "documents" DROP COLUMN "folder_id";
  ALTER TABLE "media" DROP COLUMN "folder_id";
  ALTER TABLE "pages" DROP COLUMN "folder_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_folder_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "folders_id";
  DROP TYPE "public"."enum_folders_folder_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_folders_folder_type" AS ENUM('documents', 'media', 'pages');
  CREATE TABLE "folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "folders" (
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
  ALTER TABLE "folders_folder_type" ADD CONSTRAINT "folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "folders" ADD CONSTRAINT "folders_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "folders_folder_type_order_idx" ON "folders_folder_type" USING btree ("order");
  CREATE INDEX "folders_folder_type_parent_idx" ON "folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "folders_name_idx" ON "folders" USING btree ("name");
  CREATE INDEX "folders_folder_idx" ON "folders" USING btree ("folder_id");
  CREATE INDEX "folders_updated_at_idx" ON "folders" USING btree ("updated_at");
  CREATE INDEX "folders_created_at_idx" ON "folders" USING btree ("created_at");
  ALTER TABLE "documents" ADD CONSTRAINT "documents_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_folder_id_folders_id_fk" FOREIGN KEY ("version_folder_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_folders_fk" FOREIGN KEY ("folders_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "documents_folder_idx" ON "documents" USING btree ("folder_id");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "pages_folder_idx" ON "pages" USING btree ("folder_id");
  CREATE INDEX "_pages_v_version_version_folder_idx" ON "_pages_v" USING btree ("version_folder_id");
  CREATE INDEX "payload_locked_documents_rels_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("folders_id");`)
}
