import { notFound } from 'next/navigation'
import type { Locale } from 'next-intl'

import { redirect } from '@/i18n/navigation'
import { getCachedRedirects } from '@/utils/getCachedRedirects'

interface PayloadRedirectsProps {
  disableNotFound?: boolean
  url: string
  locale: Locale
}

export const PayloadRedirects = async ({ disableNotFound, url, locale }: PayloadRedirectsProps) => {
  const redirects = await getCachedRedirects()

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

    if (redirectUrl) redirect({ href: redirectUrl, locale })
  }

  if (disableNotFound) return null

  notFound()
}
