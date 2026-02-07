import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_main_navigation_items_children_subchildren_type" ADD VALUE 'page-navigation' BEFORE 'external';
  ALTER TYPE "public"."enum_main_navigation_items_children_type" ADD VALUE 'page-navigation' BEFORE 'external';
  ALTER TYPE "public"."enum_main_navigation_items_type" ADD VALUE 'page-navigation' BEFORE 'external';
  ALTER TYPE "public"."enum__main_navigation_v_version_items_children_subchildren_type" ADD VALUE 'page-navigation' BEFORE 'external';
  ALTER TYPE "public"."enum__main_navigation_v_version_items_children_type" ADD VALUE 'page-navigation' BEFORE 'external';
  ALTER TYPE "public"."enum__main_navigation_v_version_items_type" ADD VALUE 'page-navigation' BEFORE 'external';
  ALTER TABLE "main_navigation_items_children_subchildren" ADD COLUMN "page_navigation_id" integer;
  ALTER TABLE "main_navigation_items_children_subchildren" ADD COLUMN "page_index" numeric DEFAULT 0;
  ALTER TABLE "main_navigation_items_children" ADD COLUMN "page_navigation_id" integer;
  ALTER TABLE "main_navigation_items_children" ADD COLUMN "page_index" numeric DEFAULT 0;
  ALTER TABLE "main_navigation_items" ADD COLUMN "page_navigation_id" integer;
  ALTER TABLE "main_navigation_items" ADD COLUMN "page_index" numeric DEFAULT 0;
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren" ADD COLUMN "page_navigation_id" integer;
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren" ADD COLUMN "page_index" numeric DEFAULT 0;
  ALTER TABLE "_main_navigation_v_version_items_children" ADD COLUMN "page_navigation_id" integer;
  ALTER TABLE "_main_navigation_v_version_items_children" ADD COLUMN "page_index" numeric DEFAULT 0;
  ALTER TABLE "_main_navigation_v_version_items" ADD COLUMN "page_navigation_id" integer;
  ALTER TABLE "_main_navigation_v_version_items" ADD COLUMN "page_index" numeric DEFAULT 0;
  ALTER TABLE "main_navigation_items_children_subchildren" ADD CONSTRAINT "main_navigation_items_children_subchildren_page_navigation_id_page_navigations_id_fk" FOREIGN KEY ("page_navigation_id") REFERENCES "public"."page_navigations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "main_navigation_items_children" ADD CONSTRAINT "main_navigation_items_children_page_navigation_id_page_navigations_id_fk" FOREIGN KEY ("page_navigation_id") REFERENCES "public"."page_navigations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "main_navigation_items" ADD CONSTRAINT "main_navigation_items_page_navigation_id_page_navigations_id_fk" FOREIGN KEY ("page_navigation_id") REFERENCES "public"."page_navigations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren" ADD CONSTRAINT "_main_navigation_v_version_items_children_subchildren_page_navigation_id_page_navigations_id_fk" FOREIGN KEY ("page_navigation_id") REFERENCES "public"."page_navigations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items_children" ADD CONSTRAINT "_main_navigation_v_version_items_children_page_navigation_id_page_navigations_id_fk" FOREIGN KEY ("page_navigation_id") REFERENCES "public"."page_navigations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items" ADD CONSTRAINT "_main_navigation_v_version_items_page_navigation_id_page_navigations_id_fk" FOREIGN KEY ("page_navigation_id") REFERENCES "public"."page_navigations"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "main_navigation_items_children_subchildren_page_navigati_idx" ON "main_navigation_items_children_subchildren" USING btree ("page_navigation_id");
  CREATE INDEX "main_navigation_items_children_page_navigation_idx" ON "main_navigation_items_children" USING btree ("page_navigation_id");
  CREATE INDEX "main_navigation_items_page_navigation_idx" ON "main_navigation_items" USING btree ("page_navigation_id");
  CREATE INDEX "_main_navigation_v_version_items_children_subchildren__1_idx" ON "_main_navigation_v_version_items_children_subchildren" USING btree ("page_navigation_id");
  CREATE INDEX "_main_navigation_v_version_items_children_page_navigatio_idx" ON "_main_navigation_v_version_items_children" USING btree ("page_navigation_id");
  CREATE INDEX "_main_navigation_v_version_items_page_navigation_idx" ON "_main_navigation_v_version_items" USING btree ("page_navigation_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "main_navigation_items_children_subchildren" DROP CONSTRAINT "main_navigation_items_children_subchildren_page_navigation_id_page_navigations_id_fk";
  
  ALTER TABLE "main_navigation_items_children" DROP CONSTRAINT "main_navigation_items_children_page_navigation_id_page_navigations_id_fk";
  
  ALTER TABLE "main_navigation_items" DROP CONSTRAINT "main_navigation_items_page_navigation_id_page_navigations_id_fk";
  
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren" DROP CONSTRAINT "_main_navigation_v_version_items_children_subchildren_page_navigation_id_page_navigations_id_fk";
  
  ALTER TABLE "_main_navigation_v_version_items_children" DROP CONSTRAINT "_main_navigation_v_version_items_children_page_navigation_id_page_navigations_id_fk";
  
  ALTER TABLE "_main_navigation_v_version_items" DROP CONSTRAINT "_main_navigation_v_version_items_page_navigation_id_page_navigations_id_fk";
  
  ALTER TABLE "main_navigation_items_children_subchildren" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "main_navigation_items_children_subchildren" ALTER COLUMN "type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_main_navigation_items_children_subchildren_type";
  CREATE TYPE "public"."enum_main_navigation_items_children_subchildren_type" AS ENUM('page', 'external', 'menu');
  ALTER TABLE "main_navigation_items_children_subchildren" ALTER COLUMN "type" SET DEFAULT 'page'::"public"."enum_main_navigation_items_children_subchildren_type";
  ALTER TABLE "main_navigation_items_children_subchildren" ALTER COLUMN "type" SET DATA TYPE "public"."enum_main_navigation_items_children_subchildren_type" USING "type"::"public"."enum_main_navigation_items_children_subchildren_type";
  ALTER TABLE "main_navigation_items_children" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "main_navigation_items_children" ALTER COLUMN "type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_main_navigation_items_children_type";
  CREATE TYPE "public"."enum_main_navigation_items_children_type" AS ENUM('page', 'external', 'menu');
  ALTER TABLE "main_navigation_items_children" ALTER COLUMN "type" SET DEFAULT 'page'::"public"."enum_main_navigation_items_children_type";
  ALTER TABLE "main_navigation_items_children" ALTER COLUMN "type" SET DATA TYPE "public"."enum_main_navigation_items_children_type" USING "type"::"public"."enum_main_navigation_items_children_type";
  ALTER TABLE "main_navigation_items" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "main_navigation_items" ALTER COLUMN "type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_main_navigation_items_type";
  CREATE TYPE "public"."enum_main_navigation_items_type" AS ENUM('page', 'external', 'menu');
  ALTER TABLE "main_navigation_items" ALTER COLUMN "type" SET DEFAULT 'page'::"public"."enum_main_navigation_items_type";
  ALTER TABLE "main_navigation_items" ALTER COLUMN "type" SET DATA TYPE "public"."enum_main_navigation_items_type" USING "type"::"public"."enum_main_navigation_items_type";
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren" ALTER COLUMN "type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__main_navigation_v_version_items_children_subchildren_type";
  CREATE TYPE "public"."enum__main_navigation_v_version_items_children_subchildren_type" AS ENUM('page', 'external', 'menu');
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren" ALTER COLUMN "type" SET DEFAULT 'page'::"public"."enum__main_navigation_v_version_items_children_subchildren_type";
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren" ALTER COLUMN "type" SET DATA TYPE "public"."enum__main_navigation_v_version_items_children_subchildren_type" USING "type"::"public"."enum__main_navigation_v_version_items_children_subchildren_type";
  ALTER TABLE "_main_navigation_v_version_items_children" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "_main_navigation_v_version_items_children" ALTER COLUMN "type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__main_navigation_v_version_items_children_type";
  CREATE TYPE "public"."enum__main_navigation_v_version_items_children_type" AS ENUM('page', 'external', 'menu');
  ALTER TABLE "_main_navigation_v_version_items_children" ALTER COLUMN "type" SET DEFAULT 'page'::"public"."enum__main_navigation_v_version_items_children_type";
  ALTER TABLE "_main_navigation_v_version_items_children" ALTER COLUMN "type" SET DATA TYPE "public"."enum__main_navigation_v_version_items_children_type" USING "type"::"public"."enum__main_navigation_v_version_items_children_type";
  ALTER TABLE "_main_navigation_v_version_items" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "_main_navigation_v_version_items" ALTER COLUMN "type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__main_navigation_v_version_items_type";
  CREATE TYPE "public"."enum__main_navigation_v_version_items_type" AS ENUM('page', 'external', 'menu');
  ALTER TABLE "_main_navigation_v_version_items" ALTER COLUMN "type" SET DEFAULT 'page'::"public"."enum__main_navigation_v_version_items_type";
  ALTER TABLE "_main_navigation_v_version_items" ALTER COLUMN "type" SET DATA TYPE "public"."enum__main_navigation_v_version_items_type" USING "type"::"public"."enum__main_navigation_v_version_items_type";
  DROP INDEX "main_navigation_items_children_subchildren_page_navigati_idx";
  DROP INDEX "main_navigation_items_children_page_navigation_idx";
  DROP INDEX "main_navigation_items_page_navigation_idx";
  DROP INDEX "_main_navigation_v_version_items_children_subchildren__1_idx";
  DROP INDEX "_main_navigation_v_version_items_children_page_navigatio_idx";
  DROP INDEX "_main_navigation_v_version_items_page_navigation_idx";
  ALTER TABLE "main_navigation_items_children_subchildren" DROP COLUMN "page_navigation_id";
  ALTER TABLE "main_navigation_items_children_subchildren" DROP COLUMN "page_index";
  ALTER TABLE "main_navigation_items_children" DROP COLUMN "page_navigation_id";
  ALTER TABLE "main_navigation_items_children" DROP COLUMN "page_index";
  ALTER TABLE "main_navigation_items" DROP COLUMN "page_navigation_id";
  ALTER TABLE "main_navigation_items" DROP COLUMN "page_index";
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren" DROP COLUMN "page_navigation_id";
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren" DROP COLUMN "page_index";
  ALTER TABLE "_main_navigation_v_version_items_children" DROP COLUMN "page_navigation_id";
  ALTER TABLE "_main_navigation_v_version_items_children" DROP COLUMN "page_index";
  ALTER TABLE "_main_navigation_v_version_items" DROP COLUMN "page_navigation_id";
  ALTER TABLE "_main_navigation_v_version_items" DROP COLUMN "page_index";`)
}
