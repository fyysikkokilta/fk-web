import { notFound } from 'next/navigation'
import type { Locale } from 'next-intl'

import { redirect } from '@/i18n/navigation'
import { getRedirects } from '@/lib/getRedirects'

interface PayloadRedirectsProps {
  disableNotFound?: boolean
  url: string
  locale: Locale
}

export const PayloadRedirects = async ({ disableNotFound, url, locale }: PayloadRedirectsProps) => {
  const redirects = await getRedirects()

  const urlWithLocale = `/${locale}${url}`

  const redirectItem = redirects.find(
    (redirect) => redirect.from === url || redirect.from === urlWithLocale
  )

  if (redirectItem) {
    const to = redirectItem.to

    const redirectUrl =
      to?.type === 'reference'
        ? !!to.reference?.value && typeof to.reference.value === 'object'
          ? `/${to.reference.value.path}`
          : undefined
        : to?.url

    // Avoid self-redirects and locale duplication
    if (redirectUrl) {
      const normalizedTarget = redirectUrl.startsWith('/') ? redirectUrl : `/${redirectUrl}`
      const normalizedSource = url.startsWith('/') ? url : `/${url}`
      const isSamePath = normalizedTarget === normalizedSource || normalizedTarget === urlWithLocale
      if (!isSamePath) {
        redirect({ href: normalizedTarget, locale })
      }
    }
  }

  if (disableNotFound) return null

  notFound()
}
