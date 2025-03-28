import createMiddleware from 'next-intl/middleware'

import { routing } from '@/i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/', '/(fi|en)/:path*', '/((?!newsletters|api|_next|_vercel|admin|.*\\..*).*)']
}
