'use client'

import { useEffect } from 'react'

type SyncPageUrlProps = {
  currentSlug: string
  canonicalPath: string | null
  locale: string
}

/**
 * Updates the browser URL to the canonical path for the current locale when the user
 * landed on the page via the other locale's slug (e.g. /en/fuksille → /en/for-students).
 * Uses replaceState so the page does not reload.
 */
export function SyncPageUrl({ currentSlug, canonicalPath, locale }: SyncPageUrlProps) {
  useEffect(() => {
    if (!canonicalPath || currentSlug === canonicalPath) return

    const canonicalUrl = `/${locale}/${canonicalPath}`
    window.history.replaceState(null, '', canonicalUrl)
  }, [currentSlug, canonicalPath, locale])

  return null
}
