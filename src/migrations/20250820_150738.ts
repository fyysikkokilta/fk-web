import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "_main_navigation_v_version_items_children_subchildren_page_idx";
  ALTER TABLE "exports" ADD COLUMN "page" numeric DEFAULT 1;
  CREATE INDEX "_main_navigation_v_version_items_children_subchildren_pa_idx" ON "_main_navigation_v_version_items_children_subchildren" USING btree ("page_id");
  ALTER TABLE "exports" DROP COLUMN "selection_to_use";
  DROP TYPE "public"."enum_exports_selection_to_use";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_exports_selection_to_use" AS ENUM('currentSelection', 'currentFilters', 'all');
  DROP INDEX "_main_navigation_v_version_items_children_subchildren_pa_idx";
  ALTER TABLE "exports" ADD COLUMN "selection_to_use" "enum_exports_selection_to_use";
  CREATE INDEX "_main_navigation_v_version_items_children_subchildren_page_idx" ON "_main_navigation_v_version_items_children_subchildren" USING btree ("page_id");
  ALTER TABLE "exports" DROP COLUMN "page";`)
}
