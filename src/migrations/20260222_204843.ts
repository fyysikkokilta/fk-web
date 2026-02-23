import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "exports" ALTER COLUMN "collection_slug" SET DEFAULT 'board-members';
  ALTER TABLE "imports" ALTER COLUMN "collection_slug" SET DATA TYPE varchar;
  ALTER TABLE "imports" ALTER COLUMN "collection_slug" SET DEFAULT 'board-members';
  DROP TYPE "public"."enum_imports_collection_slug";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_imports_collection_slug" AS ENUM();
  ALTER TABLE "exports" ALTER COLUMN "collection_slug" DROP DEFAULT;
  ALTER TABLE "imports" ALTER COLUMN "collection_slug" SET DATA TYPE "public"."enum_imports_collection_slug" USING "collection_slug"::"public"."enum_imports_collection_slug";
  ALTER TABLE "imports" ALTER COLUMN "collection_slug" DROP DEFAULT;`)
}
