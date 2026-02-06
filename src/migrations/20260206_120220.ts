import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "newsletter_settings" ADD COLUMN "career_career_page_id" integer;
  ALTER TABLE "newsletter_settings" ADD CONSTRAINT "newsletter_settings_career_career_page_id_pages_id_fk" FOREIGN KEY ("career_career_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "newsletter_settings_career_career_career_page_idx" ON "newsletter_settings" USING btree ("career_career_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "newsletter_settings" DROP CONSTRAINT "newsletter_settings_career_career_page_id_pages_id_fk";
  
  DROP INDEX "newsletter_settings_career_career_career_page_idx";
  ALTER TABLE "newsletter_settings" DROP COLUMN "career_career_page_id";`)
}
