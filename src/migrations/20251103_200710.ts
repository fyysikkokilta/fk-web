import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk";
  
  ALTER TABLE "main_navigation_items_children_subchildren_locales" DROP CONSTRAINT "main_navigation_items_children_subchildren_locales_parent_id_fk";
  
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren_locales" DROP CONSTRAINT "_main_navigation_v_version_items_children_subchildren_locales_parent_id_fk";
  
  ALTER TABLE "_main_navigation_v_version_items_children_locales" DROP CONSTRAINT "_main_navigation_v_version_items_children_locales_parent_id_fk";
  
  DROP INDEX "exports_texts_order_parent_idx";
  DROP INDEX "payload_locked_documents_rels_payload_jobs_id_idx";
  DROP INDEX "main_navigation_items_children_subchildren_locales_locale_parent_id_unique";
  DROP INDEX "main_navigation_items_children_locales_locale_parent_id_unique";
  DROP INDEX "_main_navigation_v_version_items_children_subchildren_locales_locale_parent_id_unique";
  DROP INDEX "_main_navigation_v_version_items_children_locales_locale_parent_id_unique";
  DROP INDEX "_main_navigation_v_version_items_locales_locale_parent_id_unique";
  DROP INDEX "footer_texts_order_parent_idx";
  DROP INDEX "landing_page_texts_order_parent_idx";
  DROP INDEX "_landing_page_v_texts_order_parent_idx";
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  ALTER TABLE "main_navigation_items_children_subchildren_locales" ADD CONSTRAINT "main_navigation_items_children_subchildren_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation_items_children_subchildren"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren_locales" ADD CONSTRAINT "_main_navigation_v_version_items_children_subchildren_loc_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_main_navigation_v_version_items_children_subchildren"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items_children_locales" ADD CONSTRAINT "_main_navigation_v_version_items_children_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_main_navigation_v_version_items_children"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "exports_texts_order_parent" ON "exports_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "main_navigation_items_children_subchildren_locales_locale_pa" ON "main_navigation_items_children_subchildren_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "main_navigation_items_children_locales_locale_parent_id_uniq" ON "main_navigation_items_children_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_main_navigation_v_version_items_children_subchildren_locale" ON "_main_navigation_v_version_items_children_subchildren_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_main_navigation_v_version_items_children_locales_locale_par" ON "_main_navigation_v_version_items_children_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_main_navigation_v_version_items_locales_locale_parent_id_un" ON "_main_navigation_v_version_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_texts_order_parent" ON "footer_texts" USING btree ("order","parent_id");
  CREATE INDEX "landing_page_texts_order_parent" ON "landing_page_texts" USING btree ("order","parent_id");
  CREATE INDEX "_landing_page_v_texts_order_parent" ON "_landing_page_v_texts" USING btree ("order","parent_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_jobs_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_kv" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload_kv" CASCADE;
  ALTER TABLE "main_navigation_items_children_subchildren_locales" DROP CONSTRAINT "main_navigation_items_children_subchildren_locales_parent_fk";
  
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren_locales" DROP CONSTRAINT "_main_navigation_v_version_items_children_subchildren_loc_fk";
  
  ALTER TABLE "_main_navigation_v_version_items_children_locales" DROP CONSTRAINT "_main_navigation_v_version_items_children_locales_parent__fk";
  
  DROP INDEX "exports_texts_order_parent";
  DROP INDEX "main_navigation_items_children_subchildren_locales_locale_pa";
  DROP INDEX "main_navigation_items_children_locales_locale_parent_id_uniq";
  DROP INDEX "_main_navigation_v_version_items_children_subchildren_locale";
  DROP INDEX "_main_navigation_v_version_items_children_locales_locale_par";
  DROP INDEX "_main_navigation_v_version_items_locales_locale_parent_id_un";
  DROP INDEX "footer_texts_order_parent";
  DROP INDEX "landing_page_texts_order_parent";
  DROP INDEX "_landing_page_v_texts_order_parent";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_jobs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk" FOREIGN KEY ("payload_jobs_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_navigation_items_children_subchildren_locales" ADD CONSTRAINT "main_navigation_items_children_subchildren_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation_items_children_subchildren"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items_children_subchildren_locales" ADD CONSTRAINT "_main_navigation_v_version_items_children_subchildren_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_main_navigation_v_version_items_children_subchildren"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items_children_locales" ADD CONSTRAINT "_main_navigation_v_version_items_children_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_main_navigation_v_version_items_children"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "exports_texts_order_parent_idx" ON "exports_texts" USING btree ("order","parent_id");
  CREATE INDEX "payload_locked_documents_rels_payload_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_jobs_id");
  CREATE UNIQUE INDEX "main_navigation_items_children_subchildren_locales_locale_parent_id_unique" ON "main_navigation_items_children_subchildren_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "main_navigation_items_children_locales_locale_parent_id_unique" ON "main_navigation_items_children_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_main_navigation_v_version_items_children_subchildren_locales_locale_parent_id_unique" ON "_main_navigation_v_version_items_children_subchildren_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_main_navigation_v_version_items_children_locales_locale_parent_id_unique" ON "_main_navigation_v_version_items_children_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_main_navigation_v_version_items_locales_locale_parent_id_unique" ON "_main_navigation_v_version_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_texts_order_parent_idx" ON "footer_texts" USING btree ("order","parent_id");
  CREATE INDEX "landing_page_texts_order_parent_idx" ON "landing_page_texts" USING btree ("order","parent_id");
  CREATE INDEX "_landing_page_v_texts_order_parent_idx" ON "_landing_page_v_texts" USING btree ("order","parent_id");`)
}
