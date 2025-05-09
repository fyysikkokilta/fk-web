import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fi', 'en');
  CREATE TYPE "public"."enum_newsletters_type" AS ENUM('weekly', 'career');
  CREATE TYPE "public"."enum_newsletters_sendtime_tz" AS ENUM('Europe/Helsinki');
  CREATE TYPE "public"."enum_newsletters_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__newsletters_v_version_type" AS ENUM('weekly', 'career');
  CREATE TYPE "public"."enum__newsletters_v_version_sendtime_tz" AS ENUM('Europe/Helsinki');
  CREATE TYPE "public"."enum__newsletters_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__newsletters_v_published_locale" AS ENUM('fi', 'en');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('fi', 'en');
  CREATE TYPE "public"."enum_translations_type" AS ENUM('division', 'officialRole');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_forms_redirect_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_exports_format" AS ENUM('csv', 'json');
  CREATE TYPE "public"."enum_exports_locale" AS ENUM('all', 'fi', 'en');
  CREATE TYPE "public"."enum_exports_drafts" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish', 'sendNewsletter');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_log_parent_task_slug" AS ENUM('inline', 'schedulePublish', 'sendNewsletter');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish', 'sendNewsletter');
  CREATE TYPE "public"."enum_main_navigation_items_children_subchildren_type" AS ENUM('page', 'external');
  CREATE TYPE "public"."enum_main_navigation_items_children_type" AS ENUM('page', 'external');
  CREATE TYPE "public"."enum_main_navigation_items_type" AS ENUM('page', 'external');
  CREATE TYPE "public"."enum_landing_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__landing_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__landing_page_v_published_locale" AS ENUM('fi', 'en');
  CREATE TABLE IF NOT EXISTS "board_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"email" varchar NOT NULL,
  	"telegram" varchar,
  	"phone" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "board_members_locales" (
  	"role" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "divisions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name_id" integer NOT NULL,
  	"year" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "divisions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"official_roles_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"thumbnail_id" integer,
  	"_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "fuksis" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "fuksi_groups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "fuksi_groups_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"fuksis_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"blur_data_url" varchar NOT NULL,
  	"_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "news_item_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "news_item_types_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "news_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type_id" integer NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "news_items_locales" (
  	"title" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "newsletters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_newsletters_type" DEFAULT 'weekly',
  	"newsletter_number" varchar,
  	"ready_to_send" boolean DEFAULT false,
  	"send_time" timestamp(3) with time zone DEFAULT '2025-05-09T16:00:00.000Z',
  	"sendtime_tz" "enum_newsletters_sendtime_tz" DEFAULT 'Europe/Helsinki',
  	"sent" boolean DEFAULT false,
  	"job_id" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_newsletters_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "newsletters_locales" (
  	"title" varchar,
  	"greetings" jsonb,
  	"closing_words" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "newsletters_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"news_items_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_newsletters_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_type" "enum__newsletters_v_version_type" DEFAULT 'weekly',
  	"version_newsletter_number" varchar,
  	"version_ready_to_send" boolean DEFAULT false,
  	"version_send_time" timestamp(3) with time zone DEFAULT '2025-05-09T16:00:00.000Z',
  	"version_sendtime_tz" "enum__newsletters_v_version_sendtime_tz" DEFAULT 'Europe/Helsinki',
  	"version_sent" boolean DEFAULT false,
  	"version_job_id" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__newsletters_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__newsletters_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_newsletters_v_locales" (
  	"version_title" varchar,
  	"version_greetings" jsonb,
  	"version_closing_words" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "_newsletters_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"news_items_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "official_roles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name_id" integer NOT NULL,
  	"year" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "official_roles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"officials_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "officials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"banner_image_id" integer,
  	"show_title" boolean DEFAULT true,
  	"show_table_of_contents" boolean DEFAULT false,
  	"show_partners" boolean DEFAULT false,
  	"hidden" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "pages_locales" (
  	"title" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"path" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"board_members_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_banner_image_id" integer,
  	"version_show_title" boolean DEFAULT true,
  	"version_show_table_of_contents" boolean DEFAULT false,
  	"version_show_partners" boolean DEFAULT false,
  	"version_hidden" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_locales" (
  	"version_title" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_path" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"board_members_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "page_navigations_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "page_navigations_pages_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "page_navigations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "page_navigations_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "translations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_translations_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "translations_locales" (
  	"translation" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_email_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_number_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"redirect_type" "enum_forms_redirect_type" DEFAULT 'reference',
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "forms_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "exports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"format" "enum_exports_format" DEFAULT 'csv' NOT NULL,
  	"limit" numeric,
  	"sort" varchar,
  	"locale" "enum_exports_locale" DEFAULT 'all',
  	"drafts" "enum_exports_drafts" DEFAULT 'yes',
  	"collection_slug" varchar NOT NULL,
  	"where" jsonb DEFAULT '{}'::jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "exports_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"sub" varchar,
  	"email" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb,
  	"parent_task_slug" "enum_payload_jobs_log_parent_task_slug",
  	"parent_task_i_d" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"board_members_id" integer,
  	"divisions_id" integer,
  	"documents_id" integer,
  	"fuksis_id" integer,
  	"fuksi_groups_id" integer,
  	"media_id" integer,
  	"news_item_types_id" integer,
  	"news_items_id" integer,
  	"newsletters_id" integer,
  	"official_roles_id" integer,
  	"officials_id" integer,
  	"pages_id" integer,
  	"page_navigations_id" integer,
  	"translations_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"redirects_id" integer,
  	"exports_id" integer,
  	"users_id" integer,
  	"payload_jobs_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "main_navigation_items_children_subchildren" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_main_navigation_items_children_subchildren_type" DEFAULT 'page' NOT NULL,
  	"page_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "main_navigation_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_main_navigation_items_children_type" DEFAULT 'page' NOT NULL,
  	"page_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "main_navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_main_navigation_items_type" DEFAULT 'page' NOT NULL,
  	"page_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "main_navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "main_navigation_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "footer_locales" (
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "footer_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE IF NOT EXISTS "landing_page_calendar_calendars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"calendar_id" varchar,
  	"color" varchar DEFAULT '#ff8a04',
  	"text_color" varchar DEFAULT '#ffffff'
  );
  
  CREATE TABLE IF NOT EXISTS "landing_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"announcement_color" varchar DEFAULT '#fbdb1d',
  	"announcement_text_color" varchar DEFAULT '#000000',
  	"calendar_max_events" numeric DEFAULT 8,
  	"_status" "enum_landing_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "landing_page_locales" (
  	"announcement_content" jsonb,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "landing_page_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "landing_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_landing_page_v_version_calendar_calendars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"calendar_id" varchar,
  	"color" varchar DEFAULT '#ff8a04',
  	"text_color" varchar DEFAULT '#ffffff',
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_landing_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_announcement_color" varchar DEFAULT '#fbdb1d',
  	"version_announcement_text_color" varchar DEFAULT '#000000',
  	"version_calendar_max_events" numeric DEFAULT 8,
  	"version__status" "enum__landing_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__landing_page_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_landing_page_v_locales" (
  	"version_announcement_content" jsonb,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "_landing_page_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_landing_page_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "partner_section_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"link" varchar NOT NULL,
  	"logo_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "partner_section" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "partner_section_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "newsletter_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"weekly_logo_id" integer NOT NULL,
  	"weekly_sender_email" varchar NOT NULL,
  	"weekly_weekly_page_id" integer NOT NULL,
  	"weekly_telegram_bot_token" varchar NOT NULL,
  	"career_footer" jsonb,
  	"career_sender_email" varchar NOT NULL,
  	"career_recipient_email" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "newsletter_settings_locales" (
  	"weekly_footer" jsonb,
  	"weekly_recipient_email" varchar NOT NULL,
  	"weekly_telegram_channel_id" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DO $$ BEGIN
   ALTER TABLE "board_members" ADD CONSTRAINT "board_members_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "board_members_locales" ADD CONSTRAINT "board_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."board_members"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "divisions" ADD CONSTRAINT "divisions_name_id_translations_id_fk" FOREIGN KEY ("name_id") REFERENCES "public"."translations"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "divisions_rels" ADD CONSTRAINT "divisions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."divisions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "divisions_rels" ADD CONSTRAINT "divisions_rels_official_roles_fk" FOREIGN KEY ("official_roles_id") REFERENCES "public"."official_roles"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "documents" ADD CONSTRAINT "documents_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "fuksis" ADD CONSTRAINT "fuksis_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "fuksi_groups_rels" ADD CONSTRAINT "fuksi_groups_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."fuksi_groups"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "fuksi_groups_rels" ADD CONSTRAINT "fuksi_groups_rels_fuksis_fk" FOREIGN KEY ("fuksis_id") REFERENCES "public"."fuksis"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "news_item_types_locales" ADD CONSTRAINT "news_item_types_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_item_types"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "news_items" ADD CONSTRAINT "news_items_type_id_news_item_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."news_item_types"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "news_items_locales" ADD CONSTRAINT "news_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "newsletters_locales" ADD CONSTRAINT "newsletters_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."newsletters"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "newsletters_rels" ADD CONSTRAINT "newsletters_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."newsletters"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "newsletters_rels" ADD CONSTRAINT "newsletters_rels_news_items_fk" FOREIGN KEY ("news_items_id") REFERENCES "public"."news_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_newsletters_v" ADD CONSTRAINT "_newsletters_v_parent_id_newsletters_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."newsletters"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_newsletters_v_locales" ADD CONSTRAINT "_newsletters_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_newsletters_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_newsletters_v_rels" ADD CONSTRAINT "_newsletters_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_newsletters_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_newsletters_v_rels" ADD CONSTRAINT "_newsletters_v_rels_news_items_fk" FOREIGN KEY ("news_items_id") REFERENCES "public"."news_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "official_roles" ADD CONSTRAINT "official_roles_name_id_translations_id_fk" FOREIGN KEY ("name_id") REFERENCES "public"."translations"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "official_roles_rels" ADD CONSTRAINT "official_roles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."official_roles"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "official_roles_rels" ADD CONSTRAINT "official_roles_rels_officials_fk" FOREIGN KEY ("officials_id") REFERENCES "public"."officials"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "officials" ADD CONSTRAINT "officials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages" ADD CONSTRAINT "pages_banner_image_id_media_id_fk" FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_board_members_fk" FOREIGN KEY ("board_members_id") REFERENCES "public"."board_members"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_banner_image_id_media_id_fk" FOREIGN KEY ("version_banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_board_members_fk" FOREIGN KEY ("board_members_id") REFERENCES "public"."board_members"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "page_navigations_pages" ADD CONSTRAINT "page_navigations_pages_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "page_navigations_pages" ADD CONSTRAINT "page_navigations_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_navigations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "page_navigations_pages_locales" ADD CONSTRAINT "page_navigations_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_navigations_pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "page_navigations_locales" ADD CONSTRAINT "page_navigations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_navigations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "translations_locales" ADD CONSTRAINT "translations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."translations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_rels" ADD CONSTRAINT "forms_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "forms_rels" ADD CONSTRAINT "forms_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "exports_texts" ADD CONSTRAINT "exports_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exports"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_board_members_fk" FOREIGN KEY ("board_members_id") REFERENCES "public"."board_members"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_divisions_fk" FOREIGN KEY ("divisions_id") REFERENCES "public"."divisions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fuksis_fk" FOREIGN KEY ("fuksis_id") REFERENCES "public"."fuksis"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fuksi_groups_fk" FOREIGN KEY ("fuksi_groups_id") REFERENCES "public"."fuksi_groups"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_item_types_fk" FOREIGN KEY ("news_item_types_id") REFERENCES "public"."news_item_types"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_items_fk" FOREIGN KEY ("news_items_id") REFERENCES "public"."news_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletters_fk" FOREIGN KEY ("newsletters_id") REFERENCES "public"."newsletters"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_official_roles_fk" FOREIGN KEY ("official_roles_id") REFERENCES "public"."official_roles"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_officials_fk" FOREIGN KEY ("officials_id") REFERENCES "public"."officials"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_navigations_fk" FOREIGN KEY ("page_navigations_id") REFERENCES "public"."page_navigations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_translations_fk" FOREIGN KEY ("translations_id") REFERENCES "public"."translations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_exports_fk" FOREIGN KEY ("exports_id") REFERENCES "public"."exports"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk" FOREIGN KEY ("payload_jobs_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "main_navigation_items_children_subchildren" ADD CONSTRAINT "main_navigation_items_children_subchildren_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "main_navigation_items_children_subchildren" ADD CONSTRAINT "main_navigation_items_children_subchildren_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation_items_children"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "main_navigation_items_children" ADD CONSTRAINT "main_navigation_items_children_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "main_navigation_items_children" ADD CONSTRAINT "main_navigation_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "main_navigation_items" ADD CONSTRAINT "main_navigation_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "main_navigation_items" ADD CONSTRAINT "main_navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "main_navigation" ADD CONSTRAINT "main_navigation_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "main_navigation_locales" ADD CONSTRAINT "main_navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_texts" ADD CONSTRAINT "footer_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "landing_page_calendar_calendars" ADD CONSTRAINT "landing_page_calendar_calendars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "landing_page_locales" ADD CONSTRAINT "landing_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "landing_page_locales" ADD CONSTRAINT "landing_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "landing_page_texts" ADD CONSTRAINT "landing_page_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "landing_page_rels" ADD CONSTRAINT "landing_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "landing_page_rels" ADD CONSTRAINT "landing_page_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_landing_page_v_version_calendar_calendars" ADD CONSTRAINT "_landing_page_v_version_calendar_calendars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_page_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_landing_page_v_locales" ADD CONSTRAINT "_landing_page_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_landing_page_v_locales" ADD CONSTRAINT "_landing_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_page_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_landing_page_v_texts" ADD CONSTRAINT "_landing_page_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_page_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_landing_page_v_rels" ADD CONSTRAINT "_landing_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_page_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_landing_page_v_rels" ADD CONSTRAINT "_landing_page_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "partner_section_partners" ADD CONSTRAINT "partner_section_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "partner_section_partners" ADD CONSTRAINT "partner_section_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partner_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "partner_section_locales" ADD CONSTRAINT "partner_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partner_section"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "newsletter_settings" ADD CONSTRAINT "newsletter_settings_weekly_logo_id_media_id_fk" FOREIGN KEY ("weekly_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "newsletter_settings" ADD CONSTRAINT "newsletter_settings_weekly_weekly_page_id_pages_id_fk" FOREIGN KEY ("weekly_weekly_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "newsletter_settings_locales" ADD CONSTRAINT "newsletter_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."newsletter_settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "board_members_image_idx" ON "board_members" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "board_members_updated_at_idx" ON "board_members" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "board_members_created_at_idx" ON "board_members" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "board_members_locales_locale_parent_id_unique" ON "board_members_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "divisions_name_idx" ON "divisions" USING btree ("name_id");
  CREATE INDEX IF NOT EXISTS "divisions_updated_at_idx" ON "divisions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "divisions_created_at_idx" ON "divisions" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "divisions_rels_order_idx" ON "divisions_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "divisions_rels_parent_idx" ON "divisions_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "divisions_rels_path_idx" ON "divisions_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "divisions_rels_official_roles_id_idx" ON "divisions_rels" USING btree ("official_roles_id");
  CREATE INDEX IF NOT EXISTS "documents_thumbnail_idx" ON "documents" USING btree ("thumbnail_id");
  CREATE INDEX IF NOT EXISTS "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "fuksis_photo_idx" ON "fuksis" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "fuksis_updated_at_idx" ON "fuksis" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "fuksis_created_at_idx" ON "fuksis" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "fuksi_groups_updated_at_idx" ON "fuksi_groups" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "fuksi_groups_created_at_idx" ON "fuksi_groups" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "fuksi_groups_rels_order_idx" ON "fuksi_groups_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "fuksi_groups_rels_parent_idx" ON "fuksi_groups_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "fuksi_groups_rels_path_idx" ON "fuksi_groups_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "fuksi_groups_rels_fuksis_id_idx" ON "fuksi_groups_rels" USING btree ("fuksis_id");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "news_item_types_value_idx" ON "news_item_types" USING btree ("value");
  CREATE INDEX IF NOT EXISTS "news_item_types_updated_at_idx" ON "news_item_types" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "news_item_types_created_at_idx" ON "news_item_types" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "news_item_types_locales_locale_parent_id_unique" ON "news_item_types_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "news_items_type_idx" ON "news_items" USING btree ("type_id");
  CREATE INDEX IF NOT EXISTS "news_items_updated_at_idx" ON "news_items" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "news_items_created_at_idx" ON "news_items" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "news_items_locales_locale_parent_id_unique" ON "news_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "newsletters_newsletter_number_idx" ON "newsletters" USING btree ("newsletter_number");
  CREATE INDEX IF NOT EXISTS "newsletters_updated_at_idx" ON "newsletters" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "newsletters_created_at_idx" ON "newsletters" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "newsletters__status_idx" ON "newsletters" USING btree ("_status");
  CREATE UNIQUE INDEX IF NOT EXISTS "newsletters_locales_locale_parent_id_unique" ON "newsletters_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "newsletters_rels_order_idx" ON "newsletters_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "newsletters_rels_parent_idx" ON "newsletters_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "newsletters_rels_path_idx" ON "newsletters_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "newsletters_rels_news_items_id_idx" ON "newsletters_rels" USING btree ("news_items_id");
  CREATE INDEX IF NOT EXISTS "_newsletters_v_parent_idx" ON "_newsletters_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_newsletters_v_version_version_newsletter_number_idx" ON "_newsletters_v" USING btree ("version_newsletter_number");
  CREATE INDEX IF NOT EXISTS "_newsletters_v_version_version_updated_at_idx" ON "_newsletters_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_newsletters_v_version_version_created_at_idx" ON "_newsletters_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_newsletters_v_version_version__status_idx" ON "_newsletters_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_newsletters_v_created_at_idx" ON "_newsletters_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_newsletters_v_updated_at_idx" ON "_newsletters_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_newsletters_v_snapshot_idx" ON "_newsletters_v" USING btree ("snapshot");
  CREATE INDEX IF NOT EXISTS "_newsletters_v_published_locale_idx" ON "_newsletters_v" USING btree ("published_locale");
  CREATE INDEX IF NOT EXISTS "_newsletters_v_latest_idx" ON "_newsletters_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_newsletters_v_autosave_idx" ON "_newsletters_v" USING btree ("autosave");
  CREATE UNIQUE INDEX IF NOT EXISTS "_newsletters_v_locales_locale_parent_id_unique" ON "_newsletters_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_newsletters_v_rels_order_idx" ON "_newsletters_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_newsletters_v_rels_parent_idx" ON "_newsletters_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_newsletters_v_rels_path_idx" ON "_newsletters_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_newsletters_v_rels_news_items_id_idx" ON "_newsletters_v_rels" USING btree ("news_items_id");
  CREATE INDEX IF NOT EXISTS "official_roles_name_idx" ON "official_roles" USING btree ("name_id");
  CREATE INDEX IF NOT EXISTS "official_roles_updated_at_idx" ON "official_roles" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "official_roles_created_at_idx" ON "official_roles" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "official_roles_rels_order_idx" ON "official_roles_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "official_roles_rels_parent_idx" ON "official_roles_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "official_roles_rels_path_idx" ON "official_roles_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "official_roles_rels_officials_id_idx" ON "official_roles_rels" USING btree ("officials_id");
  CREATE INDEX IF NOT EXISTS "officials_photo_idx" ON "officials" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "officials_updated_at_idx" ON "officials" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "officials_created_at_idx" ON "officials" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "pages_banner_image_idx" ON "pages" USING btree ("banner_image_id");
  CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_path_idx" ON "pages_locales" USING btree ("path","_locale");
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "pages_rels_board_members_id_idx" ON "pages_rels" USING btree ("board_members_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_banner_image_idx" ON "_pages_v" USING btree ("version_banner_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX IF NOT EXISTS "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_path_idx" ON "_pages_v_locales" USING btree ("version_path","_locale");
  CREATE UNIQUE INDEX IF NOT EXISTS "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_pages_v_rels_board_members_id_idx" ON "_pages_v_rels" USING btree ("board_members_id");
  CREATE INDEX IF NOT EXISTS "page_navigations_pages_order_idx" ON "page_navigations_pages" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "page_navigations_pages_parent_id_idx" ON "page_navigations_pages" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "page_navigations_pages_page_idx" ON "page_navigations_pages" USING btree ("page_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "page_navigations_pages_locales_locale_parent_id_unique" ON "page_navigations_pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "page_navigations_updated_at_idx" ON "page_navigations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "page_navigations_created_at_idx" ON "page_navigations" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "page_navigations_locales_locale_parent_id_unique" ON "page_navigations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "translations_updated_at_idx" ON "translations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "translations_created_at_idx" ON "translations" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "translations_locales_locale_parent_id_unique" ON "translations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_rels_order_idx" ON "forms_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "forms_rels_parent_idx" ON "forms_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "forms_rels_path_idx" ON "forms_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "forms_rels_pages_id_idx" ON "forms_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX IF NOT EXISTS "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX IF NOT EXISTS "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "exports_updated_at_idx" ON "exports" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "exports_created_at_idx" ON "exports" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "exports_filename_idx" ON "exports" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "exports_texts_order_parent_idx" ON "exports_texts" USING btree ("order","parent_id");
  CREATE INDEX IF NOT EXISTS "users_sub_idx" ON "users" USING btree ("sub");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX IF NOT EXISTS "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX IF NOT EXISTS "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX IF NOT EXISTS "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX IF NOT EXISTS "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX IF NOT EXISTS "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX IF NOT EXISTS "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX IF NOT EXISTS "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_board_members_id_idx" ON "payload_locked_documents_rels" USING btree ("board_members_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_divisions_id_idx" ON "payload_locked_documents_rels" USING btree ("divisions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_fuksis_id_idx" ON "payload_locked_documents_rels" USING btree ("fuksis_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_fuksi_groups_id_idx" ON "payload_locked_documents_rels" USING btree ("fuksi_groups_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_news_item_types_id_idx" ON "payload_locked_documents_rels" USING btree ("news_item_types_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_news_items_id_idx" ON "payload_locked_documents_rels" USING btree ("news_items_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_newsletters_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletters_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_official_roles_id_idx" ON "payload_locked_documents_rels" USING btree ("official_roles_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_officials_id_idx" ON "payload_locked_documents_rels" USING btree ("officials_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_page_navigations_id_idx" ON "payload_locked_documents_rels" USING btree ("page_navigations_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_translations_id_idx" ON "payload_locked_documents_rels" USING btree ("translations_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_exports_id_idx" ON "payload_locked_documents_rels" USING btree ("exports_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_payload_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_jobs_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "main_navigation_items_children_subchildren_order_idx" ON "main_navigation_items_children_subchildren" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "main_navigation_items_children_subchildren_parent_id_idx" ON "main_navigation_items_children_subchildren" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "main_navigation_items_children_subchildren_locale_idx" ON "main_navigation_items_children_subchildren" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "main_navigation_items_children_subchildren_page_idx" ON "main_navigation_items_children_subchildren" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "main_navigation_items_children_order_idx" ON "main_navigation_items_children" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "main_navigation_items_children_parent_id_idx" ON "main_navigation_items_children" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "main_navigation_items_children_locale_idx" ON "main_navigation_items_children" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "main_navigation_items_children_page_idx" ON "main_navigation_items_children" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "main_navigation_items_order_idx" ON "main_navigation_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "main_navigation_items_parent_id_idx" ON "main_navigation_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "main_navigation_items_locale_idx" ON "main_navigation_items" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "main_navigation_items_page_idx" ON "main_navigation_items" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "main_navigation_logo_idx" ON "main_navigation" USING btree ("logo_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "main_navigation_locales_locale_parent_id_unique" ON "main_navigation_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_texts_order_parent_idx" ON "footer_texts" USING btree ("order","parent_id");
  CREATE INDEX IF NOT EXISTS "footer_texts_locale_parent" ON "footer_texts" USING btree ("locale","parent_id");
  CREATE INDEX IF NOT EXISTS "landing_page_calendar_calendars_order_idx" ON "landing_page_calendar_calendars" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "landing_page_calendar_calendars_parent_id_idx" ON "landing_page_calendar_calendars" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "landing_page__status_idx" ON "landing_page" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "landing_page_meta_meta_image_idx" ON "landing_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX IF NOT EXISTS "landing_page_locales_locale_parent_id_unique" ON "landing_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "landing_page_texts_order_parent_idx" ON "landing_page_texts" USING btree ("order","parent_id");
  CREATE INDEX IF NOT EXISTS "landing_page_rels_order_idx" ON "landing_page_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "landing_page_rels_parent_idx" ON "landing_page_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "landing_page_rels_path_idx" ON "landing_page_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "landing_page_rels_media_id_idx" ON "landing_page_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "_landing_page_v_version_calendar_calendars_order_idx" ON "_landing_page_v_version_calendar_calendars" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_landing_page_v_version_calendar_calendars_parent_id_idx" ON "_landing_page_v_version_calendar_calendars" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_landing_page_v_version_version__status_idx" ON "_landing_page_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_landing_page_v_created_at_idx" ON "_landing_page_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_landing_page_v_updated_at_idx" ON "_landing_page_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_landing_page_v_snapshot_idx" ON "_landing_page_v" USING btree ("snapshot");
  CREATE INDEX IF NOT EXISTS "_landing_page_v_published_locale_idx" ON "_landing_page_v" USING btree ("published_locale");
  CREATE INDEX IF NOT EXISTS "_landing_page_v_latest_idx" ON "_landing_page_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_landing_page_v_autosave_idx" ON "_landing_page_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_landing_page_v_version_meta_version_meta_image_idx" ON "_landing_page_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX IF NOT EXISTS "_landing_page_v_locales_locale_parent_id_unique" ON "_landing_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "_landing_page_v_texts_order_parent_idx" ON "_landing_page_v_texts" USING btree ("order","parent_id");
  CREATE INDEX IF NOT EXISTS "_landing_page_v_rels_order_idx" ON "_landing_page_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_landing_page_v_rels_parent_idx" ON "_landing_page_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_landing_page_v_rels_path_idx" ON "_landing_page_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_landing_page_v_rels_media_id_idx" ON "_landing_page_v_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "partner_section_partners_order_idx" ON "partner_section_partners" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "partner_section_partners_parent_id_idx" ON "partner_section_partners" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "partner_section_partners_logo_idx" ON "partner_section_partners" USING btree ("logo_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "partner_section_locales_locale_parent_id_unique" ON "partner_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "newsletter_settings_weekly_weekly_logo_idx" ON "newsletter_settings" USING btree ("weekly_logo_id");
  CREATE INDEX IF NOT EXISTS "newsletter_settings_weekly_weekly_weekly_page_idx" ON "newsletter_settings" USING btree ("weekly_weekly_page_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "newsletter_settings_locales_locale_parent_id_unique" ON "newsletter_settings_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "board_members" CASCADE;
  DROP TABLE "board_members_locales" CASCADE;
  DROP TABLE "divisions" CASCADE;
  DROP TABLE "divisions_rels" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "fuksis" CASCADE;
  DROP TABLE "fuksi_groups" CASCADE;
  DROP TABLE "fuksi_groups_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "news_item_types" CASCADE;
  DROP TABLE "news_item_types_locales" CASCADE;
  DROP TABLE "news_items" CASCADE;
  DROP TABLE "news_items_locales" CASCADE;
  DROP TABLE "newsletters" CASCADE;
  DROP TABLE "newsletters_locales" CASCADE;
  DROP TABLE "newsletters_rels" CASCADE;
  DROP TABLE "_newsletters_v" CASCADE;
  DROP TABLE "_newsletters_v_locales" CASCADE;
  DROP TABLE "_newsletters_v_rels" CASCADE;
  DROP TABLE "official_roles" CASCADE;
  DROP TABLE "official_roles_rels" CASCADE;
  DROP TABLE "officials" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "page_navigations_pages" CASCADE;
  DROP TABLE "page_navigations_pages_locales" CASCADE;
  DROP TABLE "page_navigations" CASCADE;
  DROP TABLE "page_navigations_locales" CASCADE;
  DROP TABLE "translations" CASCADE;
  DROP TABLE "translations_locales" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_email_locales" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_message_locales" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_number_locales" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_select_locales" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_text_locales" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms_emails_locales" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "forms_rels" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "exports" CASCADE;
  DROP TABLE "exports_texts" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "main_navigation_items_children_subchildren" CASCADE;
  DROP TABLE "main_navigation_items_children" CASCADE;
  DROP TABLE "main_navigation_items" CASCADE;
  DROP TABLE "main_navigation" CASCADE;
  DROP TABLE "main_navigation_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "footer_texts" CASCADE;
  DROP TABLE "landing_page_calendar_calendars" CASCADE;
  DROP TABLE "landing_page" CASCADE;
  DROP TABLE "landing_page_locales" CASCADE;
  DROP TABLE "landing_page_texts" CASCADE;
  DROP TABLE "landing_page_rels" CASCADE;
  DROP TABLE "_landing_page_v_version_calendar_calendars" CASCADE;
  DROP TABLE "_landing_page_v" CASCADE;
  DROP TABLE "_landing_page_v_locales" CASCADE;
  DROP TABLE "_landing_page_v_texts" CASCADE;
  DROP TABLE "_landing_page_v_rels" CASCADE;
  DROP TABLE "partner_section_partners" CASCADE;
  DROP TABLE "partner_section" CASCADE;
  DROP TABLE "partner_section_locales" CASCADE;
  DROP TABLE "newsletter_settings" CASCADE;
  DROP TABLE "newsletter_settings_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_newsletters_type";
  DROP TYPE "public"."enum_newsletters_sendtime_tz";
  DROP TYPE "public"."enum_newsletters_status";
  DROP TYPE "public"."enum__newsletters_v_version_type";
  DROP TYPE "public"."enum__newsletters_v_version_sendtime_tz";
  DROP TYPE "public"."enum__newsletters_v_version_status";
  DROP TYPE "public"."enum__newsletters_v_published_locale";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_translations_type";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_forms_redirect_type";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_exports_format";
  DROP TYPE "public"."enum_exports_locale";
  DROP TYPE "public"."enum_exports_drafts";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_log_parent_task_slug";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_main_navigation_items_children_subchildren_type";
  DROP TYPE "public"."enum_main_navigation_items_children_type";
  DROP TYPE "public"."enum_main_navigation_items_type";
  DROP TYPE "public"."enum_landing_page_status";
  DROP TYPE "public"."enum__landing_page_v_version_status";
  DROP TYPE "public"."enum__landing_page_v_published_locale";`)
}
