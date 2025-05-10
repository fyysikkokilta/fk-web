import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { env } from '@/env'

export async function GET(request: NextRequest) {
  const payload = await getPayload({
    config: configPromise
  })

  // Get the user from the request
  const { user } = await payload.auth({ headers: request.headers })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  // Get the redirect URL from query parameters
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ message: 'Page not found' }, { status: 404 })
  }

  // Enable draft mode
  const draft = await draftMode()
  draft.enable()

  // Redirect to the requested page
  return NextResponse.redirect(new URL(slug, env.NEXT_PUBLIC_SERVER_URL))
}
