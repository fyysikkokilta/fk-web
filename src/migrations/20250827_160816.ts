import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "newsletter_settings" ADD COLUMN "weekly_sender_name" varchar NOT NULL DEFAULT '';
  ALTER TABLE "newsletter_settings" ADD COLUMN "career_sender_name" varchar NOT NULL DEFAULT '';
  ALTER TABLE "newsletter_settings" ALTER COLUMN "weekly_sender_name" DROP DEFAULT;
  ALTER TABLE "newsletter_settings" ALTER COLUMN "career_sender_name" DROP DEFAULT;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "newsletter_settings" DROP COLUMN "weekly_sender_name";
  ALTER TABLE "newsletter_settings" DROP COLUMN "career_sender_name";`)
}
