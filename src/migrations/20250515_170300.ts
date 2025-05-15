import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "newsletters" ALTER COLUMN "send_time" DROP DEFAULT;
  ALTER TABLE "_newsletters_v" ALTER COLUMN "version_send_time" DROP DEFAULT;
  ALTER TABLE "documents" ADD COLUMN "prefix" varchar DEFAULT 'documents';
  ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT 'media';
  ALTER TABLE "documents" DROP COLUMN IF EXISTS "_key";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "_key";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "newsletters" ALTER COLUMN "send_time" SET DEFAULT '2025-05-09T16:00:00.000Z';
  ALTER TABLE "_newsletters_v" ALTER COLUMN "version_send_time" SET DEFAULT '2025-05-09T16:00:00.000Z';
  ALTER TABLE "documents" ADD COLUMN "_key" varchar;
  ALTER TABLE "media" ADD COLUMN "_key" varchar;
  ALTER TABLE "documents" DROP COLUMN IF EXISTS "prefix";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "prefix";`)
}
