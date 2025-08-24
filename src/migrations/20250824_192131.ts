import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "newsletter_settings" ADD COLUMN "career_title_prefix" varchar NOT NULL DEFAULT '';
  ALTER TABLE "newsletter_settings_locales" ADD COLUMN "weekly_title_prefix" varchar NOT NULL DEFAULT '';
  ALTER TABLE "newsletter_settings" ALTER COLUMN "career_title_prefix" DROP DEFAULT;
  ALTER TABLE "newsletter_settings_locales" ALTER COLUMN "weekly_title_prefix" DROP DEFAULT;
  ALTER TABLE "newsletters_locales" DROP COLUMN "title";
  ALTER TABLE "_newsletters_v_locales" DROP COLUMN "version_title";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "newsletters_locales" ADD COLUMN "title" varchar;
  ALTER TABLE "_newsletters_v_locales" ADD COLUMN "version_title" varchar;
  ALTER TABLE "newsletter_settings" DROP COLUMN "career_title_prefix";
  ALTER TABLE "newsletter_settings_locales" DROP COLUMN "weekly_title_prefix";`)
}
