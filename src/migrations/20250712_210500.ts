import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "divisions" DROP COLUMN "year";
  ALTER TABLE "official_roles" DROP COLUMN "year";
  ALTER TABLE "officials" DROP COLUMN "year";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "divisions" ADD COLUMN "year" numeric NOT NULL;
  ALTER TABLE "official_roles" ADD COLUMN "year" numeric NOT NULL;
  ALTER TABLE "officials" ADD COLUMN "year" numeric NOT NULL;`)
}
