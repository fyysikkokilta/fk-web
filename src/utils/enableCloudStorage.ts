import { env } from '@/env'

export const enableCloudStorage = () => {
  if (env.UPLOADTHING_TOKEN) {
    return true
  }
  return false
}
