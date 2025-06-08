import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_emails_locales" ALTER COLUMN "subject" SET DEFAULT 'You''ve received a new message.';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_emails_locales" ALTER COLUMN "subject" SET DEFAULT 'You''''ve received a new message.';`)
}
