import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "_main_navigation_v_autosave_idx";
  ALTER TABLE "_main_navigation_v" DROP COLUMN "autosave";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_main_navigation_v" ADD COLUMN "autosave" boolean;
  CREATE INDEX "_main_navigation_v_autosave_idx" ON "_main_navigation_v" USING btree ("autosave");`)
}
