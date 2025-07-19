import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_main_navigation_items_children_subchildren_type" ADD VALUE 'menu';
  ALTER TYPE "public"."enum_main_navigation_items_children_type" ADD VALUE 'menu';
  ALTER TYPE "public"."enum_main_navigation_items_type" ADD VALUE 'menu';
  ALTER TYPE "public"."enum__main_navigation_v_version_items_children_subchildren_type" ADD VALUE 'menu';
  ALTER TYPE "public"."enum__main_navigation_v_version_items_children_type" ADD VALUE 'menu';
  ALTER TYPE "public"."enum__main_navigation_v_version_items_type" ADD VALUE 'menu';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "main_navigation_items_children_subchildren" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "main_navigation_items_children_subchildren" ALTER COLUMN "type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_main_navigation_items_children_subchildren_type";
  CREATE TYPE "public"."enum_main_navigation_items_children_subchildren_type" AS ENUM('page', 'external');
  ALTER TABLE "main_navigation_items_children_subchildren" ALTER COLUMN "type" SET DEFAULT 'page'::"public"."enum_main_navigation_items_children_subchildren_type";
  ALTER TABLE "main_navigation_items_children_subchildren" ALTER COLUMN "type" SET DATA TYPE "public"."enum_main_navigation_items_children_subchildren_type" USING "type"::"public"."enum_main_navigation_items_children_subchildren_type";
  ALTER TABLE "main_navigation_items_children" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "main_navigation_items_children" ALTER COLUMN "type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_main_navigation_items_children_type";
  CREATE TYPE "public"."enum_main_navigation_items_children_type" AS ENUM('page', 'external');
  ALTER TABLE "main_navigation_items_children" ALTER COLUMN "type" SET DEFAULT 'page'::"public"."enum_main_navigation_items_children_type";
  ALTER TABLE "main_navigation_items_children" ALTER COLUMN "type" SET DATA TYPE "public"."enum_main_navigation_items_children_type" USING "type"::"public"."enum_main_navigation_items_children_type";
  ALTER TABLE "main_navigation_items" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "main_navigation_items" ALTER COLUMN "type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_main_navigation_items_type";
  CREATE TYPE "public"."enum_main_navigation_items_type" AS ENUM('page', 'external');
  ALTER TABLE "main_navigation_items" ALTER COLUMN "type" SET DEFAULT 'page'::"public"."enum_main_navigation_items_type";
  ALTER TABLE "main_navigation_items" ALTER COLUMN "type" SET DATA TYPE "public"."enum_main_navigation_items_type" USING "type"::"public"."enum_main_navigation_items_type";
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren" ALTER COLUMN "type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__main_navigation_v_version_items_children_subchildren_type";
  CREATE TYPE "public"."enum__main_navigation_v_version_items_children_subchildren_type" AS ENUM('page', 'external');
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren" ALTER COLUMN "type" SET DEFAULT 'page'::"public"."enum__main_navigation_v_version_items_children_subchildren_type";
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren" ALTER COLUMN "type" SET DATA TYPE "public"."enum__main_navigation_v_version_items_children_subchildren_type" USING "type"::"public"."enum__main_navigation_v_version_items_children_subchildren_type";
  ALTER TABLE "_main_navigation_v_version_items_children" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "_main_navigation_v_version_items_children" ALTER COLUMN "type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__main_navigation_v_version_items_children_type";
  CREATE TYPE "public"."enum__main_navigation_v_version_items_children_type" AS ENUM('page', 'external');
  ALTER TABLE "_main_navigation_v_version_items_children" ALTER COLUMN "type" SET DEFAULT 'page'::"public"."enum__main_navigation_v_version_items_children_type";
  ALTER TABLE "_main_navigation_v_version_items_children" ALTER COLUMN "type" SET DATA TYPE "public"."enum__main_navigation_v_version_items_children_type" USING "type"::"public"."enum__main_navigation_v_version_items_children_type";
  ALTER TABLE "_main_navigation_v_version_items" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "_main_navigation_v_version_items" ALTER COLUMN "type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__main_navigation_v_version_items_type";
  CREATE TYPE "public"."enum__main_navigation_v_version_items_type" AS ENUM('page', 'external');
  ALTER TABLE "_main_navigation_v_version_items" ALTER COLUMN "type" SET DEFAULT 'page'::"public"."enum__main_navigation_v_version_items_type";
  ALTER TABLE "_main_navigation_v_version_items" ALTER COLUMN "type" SET DATA TYPE "public"."enum__main_navigation_v_version_items_type" USING "type"::"public"."enum__main_navigation_v_version_items_type";`)
}
