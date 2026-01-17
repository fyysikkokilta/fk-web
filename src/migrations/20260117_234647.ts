import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "newsletters_newsletter_number_idx";
  DROP INDEX "_newsletters_v_version_version_newsletter_number_idx";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE UNIQUE INDEX "newsletters_newsletter_number_idx" ON "newsletters" USING btree ("newsletter_number");
  CREATE INDEX "_newsletters_v_version_version_newsletter_number_idx" ON "_newsletters_v" USING btree ("version_newsletter_number");`)
}
