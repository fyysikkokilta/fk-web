import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "landing_page_locales" ADD COLUMN "title" varchar;
  ALTER TABLE "_landing_page_v_locales" ADD COLUMN "version_title" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "landing_page_locales" DROP COLUMN "title";
  ALTER TABLE "_landing_page_v_locales" DROP COLUMN "version_title";`)
}
