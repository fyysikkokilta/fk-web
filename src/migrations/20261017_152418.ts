import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "documents" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
  CREATE INDEX "board_members_locales_parent_id_idx" ON "board_members_locales" USING btree ("_parent_id");
  CREATE INDEX "divisions_locales_parent_id_idx" ON "divisions_locales" USING btree ("_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "news_item_types_locales_parent_id_idx" ON "news_item_types_locales" USING btree ("_parent_id");
  CREATE INDEX "news_items_locales_parent_id_idx" ON "news_items_locales" USING btree ("_parent_id");
  CREATE INDEX "newsletters_locales_parent_id_idx" ON "newsletters_locales" USING btree ("_parent_id");
  CREATE INDEX "_newsletters_v_locales_parent_id_idx" ON "_newsletters_v_locales" USING btree ("_parent_id");
  CREATE INDEX "official_roles_locales_parent_id_idx" ON "official_roles_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "pages_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_locales_parent_id_idx" ON "_pages_v_locales" USING btree ("_parent_id");
  CREATE INDEX "page_navigations_pages_locales_parent_id_idx" ON "page_navigations_pages_locales" USING btree ("_parent_id");
  CREATE INDEX "page_navigations_locales_parent_id_idx" ON "page_navigations_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_locales_parent_id_idx" ON "forms_blocks_checkbox_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_locales_parent_id_idx" ON "forms_blocks_email_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_locales_parent_id_idx" ON "forms_blocks_message_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_locales_parent_id_idx" ON "forms_blocks_number_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_options_locales_parent_id_idx" ON "forms_blocks_select_options_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_locales_parent_id_idx" ON "forms_blocks_select_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_locales_parent_id_idx" ON "forms_blocks_text_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_locales_parent_id_idx" ON "forms_blocks_textarea_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_radio_options_locales_parent_id_idx" ON "forms_blocks_radio_options_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_radio_locales_parent_id_idx" ON "forms_blocks_radio_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_date_locales_parent_id_idx" ON "forms_blocks_date_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_emails_locales_parent_id_idx" ON "forms_emails_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_locales_parent_id_idx" ON "forms_locales" USING btree ("_parent_id");
  CREATE INDEX "main_navigation_items_children_subchildren_locales_paren_idx" ON "main_navigation_items_children_subchildren_locales" USING btree ("_parent_id");
  CREATE INDEX "main_navigation_items_children_locales_parent_id_idx" ON "main_navigation_items_children_locales" USING btree ("_parent_id");
  CREATE INDEX "main_navigation_items_locales_parent_id_idx" ON "main_navigation_items_locales" USING btree ("_parent_id");
  CREATE INDEX "main_navigation_locales_parent_id_idx" ON "main_navigation_locales" USING btree ("_parent_id");
  CREATE INDEX "_main_navigation_v_version_items_children_subchildren_lo_idx" ON "_main_navigation_v_version_items_children_subchildren_locales" USING btree ("_parent_id");
  CREATE INDEX "_main_navigation_v_version_items_children_locales_parent_idx" ON "_main_navigation_v_version_items_children_locales" USING btree ("_parent_id");
  CREATE INDEX "_main_navigation_v_version_items_locales_parent_id_idx" ON "_main_navigation_v_version_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_main_navigation_v_locales_parent_id_idx" ON "_main_navigation_v_locales" USING btree ("_parent_id");
  CREATE INDEX "footer_locales_parent_id_idx" ON "footer_locales" USING btree ("_parent_id");
  CREATE INDEX "landing_page_locales_parent_id_idx" ON "landing_page_locales" USING btree ("_parent_id");
  CREATE INDEX "_landing_page_v_locales_parent_id_idx" ON "_landing_page_v_locales" USING btree ("_parent_id");
  CREATE INDEX "partner_section_locales_parent_id_idx" ON "partner_section_locales" USING btree ("_parent_id");
  CREATE INDEX "newsletter_settings_locales_parent_id_idx" ON "newsletter_settings_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "board_members_locales_parent_id_idx";
  DROP INDEX "divisions_locales_parent_id_idx";
  DROP INDEX "media_locales_parent_id_idx";
  DROP INDEX "news_item_types_locales_parent_id_idx";
  DROP INDEX "news_items_locales_parent_id_idx";
  DROP INDEX "newsletters_locales_parent_id_idx";
  DROP INDEX "_newsletters_v_locales_parent_id_idx";
  DROP INDEX "official_roles_locales_parent_id_idx";
  DROP INDEX "pages_locales_parent_id_idx";
  DROP INDEX "_pages_v_locales_parent_id_idx";
  DROP INDEX "page_navigations_pages_locales_parent_id_idx";
  DROP INDEX "page_navigations_locales_parent_id_idx";
  DROP INDEX "forms_blocks_checkbox_locales_parent_id_idx";
  DROP INDEX "forms_blocks_email_locales_parent_id_idx";
  DROP INDEX "forms_blocks_message_locales_parent_id_idx";
  DROP INDEX "forms_blocks_number_locales_parent_id_idx";
  DROP INDEX "forms_blocks_select_options_locales_parent_id_idx";
  DROP INDEX "forms_blocks_select_locales_parent_id_idx";
  DROP INDEX "forms_blocks_text_locales_parent_id_idx";
  DROP INDEX "forms_blocks_textarea_locales_parent_id_idx";
  DROP INDEX "forms_blocks_radio_options_locales_parent_id_idx";
  DROP INDEX "forms_blocks_radio_locales_parent_id_idx";
  DROP INDEX "forms_blocks_date_locales_parent_id_idx";
  DROP INDEX "forms_emails_locales_parent_id_idx";
  DROP INDEX "forms_locales_parent_id_idx";
  DROP INDEX "main_navigation_items_children_subchildren_locales_paren_idx";
  DROP INDEX "main_navigation_items_children_locales_parent_id_idx";
  DROP INDEX "main_navigation_items_locales_parent_id_idx";
  DROP INDEX "main_navigation_locales_parent_id_idx";
  DROP INDEX "_main_navigation_v_version_items_children_subchildren_lo_idx";
  DROP INDEX "_main_navigation_v_version_items_children_locales_parent_idx";
  DROP INDEX "_main_navigation_v_version_items_locales_parent_id_idx";
  DROP INDEX "_main_navigation_v_locales_parent_id_idx";
  DROP INDEX "footer_locales_parent_id_idx";
  DROP INDEX "landing_page_locales_parent_id_idx";
  DROP INDEX "_landing_page_v_locales_parent_id_idx";
  DROP INDEX "partner_section_locales_parent_id_idx";
  DROP INDEX "newsletter_settings_locales_parent_id_idx";
  ALTER TABLE "documents" DROP COLUMN "_objectkey";
  ALTER TABLE "media" DROP COLUMN "_objectkey";`)
}
