import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import type { GlobalAfterChangeHook, GlobalSlug } from 'payload'

import { routing } from '@/i18n/routing'

// To revalidate only a specific page, the exact path needs to be provided.
// The path shouldn't contain the route groups or any dynamic segments.
// revalidatePath should be used with only one argument, the path.
// Eg. /fi or /se will revalidate the Finnish and Swedish landing pages respectively.

// To revalidate all pages in the dynamic segment, the filesystem path needs to be provided.
// This path HAS to contain the route groups and dynamic segments.
// revalidatePath should be used with two arguments, the path and the type of the path, 'layout' or 'page'.
// Eg. /(frontend)/[locale] will revalidate all landing pages for all locales AND all pages for all locales.

export const revalidateGlobal = (globalSlug: GlobalSlug): GlobalAfterChangeHook => {
  return async ({ req: { payload, context } }) => {
    // Don't revalidate if the skipRevalidate flag is set
    if (context.skipRevalidate) {
      return
    }

    const isLandingPage = globalSlug === 'landing-page'

    if (isLandingPage) {
      const paths = routing.locales.map((locale) => `/${locale}`)

      payload.logger.info(`Revalidating landing page at paths: ${paths.join(', ')}`)

      // Wrapping the revalidation to avoid revalidating during render.
      // This avoids the following error on job execution:
      // Route /admin/[[...segments]] used \"revalidatePath /fi/kiltajarjestys\" during render which is unsupported.
      // To ensure revalidation is performed consistently it must always happen outside of renders and cached functions.
      // See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering
      after(async () => {
        paths.forEach((path) => {
          revalidatePath(path)
        })
      })
    }

    // This is a hack to revalidate all pages when a non-landing page global is updated.
    // This should be improved in the future.
    if (!isLandingPage) {
      const path = '/(frontend)/[locale]'

      payload.logger.info(`Revalidating all pages at path: ${path}`)

      // Same as above.
      after(async () => {
        revalidatePath(path, 'layout')
      })
    }
  }
}
