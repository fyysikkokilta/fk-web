import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { getPayload } from 'payload'

import { routing } from '@/i18n/routing'

import { isDraftMode } from './utils/draftMode'

const intlMiddleware = createIntlMiddleware(routing)

function extractLocale(pathname: string) {
  // Regex to match locale at the start of the pathname
  // Matches /en/, /fi/, or just / (no locale)
  const localeRegex = /^\/(en|fi)(\/.*)?$/
  const match = pathname.match(localeRegex)

  if (match) {
    return {
      locale: match[1],
      path: match[2] ? match[2].substring(1) : ''
    }
  }

  return null
}

export default async function proxy(req: NextRequest) {
  const localeResult = extractLocale(req.nextUrl.pathname)

  if (!localeResult) {
    return intlMiddleware(req)
  }

  const { locale, path } = localeResult

  const payload = await getPayload({
    config: configPromise
  })

  const isDraft = await isDraftMode()

  const { docs: pathDocs } = await payload.find({
    collection: 'pages',
    select: {
      path: true
    },
    where: {
      path: { equals: path },
      ...(isDraft ? {} : { hidden: { equals: false } })
    },
    draft: isDraft,
    locale: 'all',
    req
  })

  if (pathDocs.length === 0) {
    return intlMiddleware(req)
  }

  const paths = pathDocs[0].path as unknown as Record<string, string | null>
  const wantedPath = paths[locale]

  if (wantedPath && wantedPath !== path) {
    return NextResponse.redirect(new URL(wantedPath, req.url), 308)
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/', '/(fi|en)/:path*', '/((?!newsletters|api|_next|_vercel|admin|.*\\..*).*)']
}
