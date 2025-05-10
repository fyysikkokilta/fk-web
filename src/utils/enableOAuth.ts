import { env } from '@/env'

export const enableOAuth = () => {
  return typeof env.GOOGLE_CLIENT_ID === 'string' && typeof env.GOOGLE_CLIENT_SECRET === 'string'
}
