import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "newsletters" ADD COLUMN "send_now" boolean DEFAULT false;
  ALTER TABLE "_newsletters_v" ADD COLUMN "version_send_now" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "newsletters" DROP COLUMN "send_now";
  ALTER TABLE "_newsletters_v" DROP COLUMN "version_send_now";`)
}
