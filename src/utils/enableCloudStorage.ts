import { env } from '@/env'

export const enableCloudStorage = () => {
  if (env.S3_BUCKET && env.S3_ACCESS_KEY_ID && env.S3_SECRET && env.S3_ENDPOINT) {
    return true
  }
  return false
}
