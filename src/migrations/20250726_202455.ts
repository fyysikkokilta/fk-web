import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "newsletters_rels_news_items_id_idx";
  DROP INDEX "_newsletters_v_rels_news_items_id_idx";
  ALTER TABLE "newsletters_rels" ADD COLUMN "locale" "_locales";
  ALTER TABLE "_newsletters_v_rels" ADD COLUMN "locale" "_locales";
  CREATE INDEX "newsletters_rels_locale_idx" ON "newsletters_rels" USING btree ("locale");
  CREATE INDEX "_newsletters_v_rels_locale_idx" ON "_newsletters_v_rels" USING btree ("locale");
  CREATE INDEX "newsletters_rels_news_items_id_idx" ON "newsletters_rels" USING btree ("news_items_id","locale");
  CREATE INDEX "_newsletters_v_rels_news_items_id_idx" ON "_newsletters_v_rels" USING btree ("news_items_id","locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "newsletters_rels_locale_idx";
  DROP INDEX "_newsletters_v_rels_locale_idx";
  DROP INDEX "newsletters_rels_news_items_id_idx";
  DROP INDEX "_newsletters_v_rels_news_items_id_idx";
  CREATE INDEX "newsletters_rels_news_items_id_idx" ON "newsletters_rels" USING btree ("news_items_id");
  CREATE INDEX "_newsletters_v_rels_news_items_id_idx" ON "_newsletters_v_rels" USING btree ("news_items_id");
  ALTER TABLE "newsletters_rels" DROP COLUMN "locale";
  ALTER TABLE "_newsletters_v_rels" DROP COLUMN "locale";`)
}
