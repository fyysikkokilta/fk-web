import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

// Define your environment variable schema here
export const env = createEnv({
  server: {
    NODE_ENV: z.string().default('development'),
    PORT: z.string().optional().default('3000'),

    DATABASE_URI: z.string(),
    PAYLOAD_SECRET: z.string(),

    SITE_NAME: z.string().default('Fyysikkokilta'),
    SITE_NAME_EN: z.string().default('Guild of Physics'),

    ALLOW_NON_EXISTING_USERS: z
      .string()
      .transform((val) => val === 'true')
      .default('false'),

    EMAIL_FROM_NAME: z.string().default('Fyysikkokilta'),
    EMAIL_FROM_ADDRESS: z.string().email().default('web@fyysikkokilta.fi'),
    SMTP_HOST: z.string().default('smtp.eu.mailgun.org'),
    SMTP_PORT: z.string().default('587'),
    SMTP_USER: z.string(),
    SMTP_PASSWORD: z.string(),

    S3_BUCKET: z.string().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET: z.string().optional(),
    S3_ENDPOINT: z.string().optional(),

    ANALYZE: z
      .string()
      .transform((val) => val === 'true')
      .default('false'),

    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_API_KEY: z.string(),

    FORM_BUILDER_DEFAULT_TO_EMAIL: z.string().email().default('it@fyysikkokilta.fi'),
    GOOGLE_SITE_VERIFICATION: z.string().optional()
  },
  client: {
    NEXT_PUBLIC_SERVER_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_S3_PUBLIC_URL: z.string().url().optional()
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_S3_PUBLIC_URL: process.env.NEXT_PUBLIC_S3_PUBLIC_URL
  },
  emptyStringAsUndefined: true
})
