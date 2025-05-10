'use client'

import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'

import { env } from '@/env'
import { useRouter } from '@/i18n/navigation'

export const RefreshRouteOnSave = () => {
  const router = useRouter()

  return (
    <PayloadLivePreview refresh={() => router.refresh()} serverURL={env.NEXT_PUBLIC_SERVER_URL} />
  )
}
