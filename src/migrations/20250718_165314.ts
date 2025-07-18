import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_folders_folder_type" AS ENUM('documents', 'media', 'pages');
  CREATE TABLE "folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "exports" ALTER COLUMN "format" DROP NOT NULL;
  ALTER TABLE "folders_folder_type" ADD CONSTRAINT "folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "folders_folder_type_order_idx" ON "folders_folder_type" USING btree ("order");
  CREATE INDEX "folders_folder_type_parent_idx" ON "folders_folder_type" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "folders_folder_type" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "folders_folder_type" CASCADE;
  ALTER TABLE "exports" ALTER COLUMN "format" SET NOT NULL;
  DROP TYPE "public"."enum_folders_folder_type";`)
}
