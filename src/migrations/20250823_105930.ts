import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_exports_sort_order" AS ENUM('asc', 'desc');
  ALTER TABLE "exports" ADD COLUMN "sort_order" "enum_exports_sort_order";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "exports" DROP COLUMN "sort_order";
  DROP TYPE "public"."enum_exports_sort_order";`)
}
