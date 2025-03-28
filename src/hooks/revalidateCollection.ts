import { revalidatePath, revalidateTag } from 'next/cache'
import { after } from 'next/server'
import type { CollectionAfterChangeHook, CollectionSlug, TypeWithID } from 'payload'

import { routing } from '@/i18n/routing'
import { Page } from '@/payload-types'

// To revalidate only a specific page, the exact path needs to be provided.
// The path shouldn't contain the route groups or any dynamic segments.
// revalidatePath should be used with only one argument, the path.
// Eg. /fi or /se will revalidate the Finnish and Swedish landing pages respectively.

// To revalidate all pages in the dynamic segment, the filesystem path needs to be provided.
// This path HAS to contain the route groups and dynamic segments.
// revalidatePath should be used with two arguments, the path and the type of the path, 'layout' or 'page'.
// Eg. /(frontend)/[locale] will revalidate all landing pages for all locales AND all pages for all locales.

export const revalidateCollection = <T extends TypeWithID>(
  collectionSlug: CollectionSlug
): CollectionAfterChangeHook<T> => {
  return async ({ doc, previousDoc, req: { payload } }) => {
    const isPage = collectionSlug === 'pages'
    const isPublished = '_status' in doc && doc._status === 'published'
    const wasPublished = '_status' in previousDoc && previousDoc._status === 'published'

    if (isPublished && isPage) {
      const page = doc as unknown as Page
      const paths = routing.locales.map((locale) => `/${locale}/${page.path}`)

      payload.logger.info(`[Page changed] Revalidating page at paths: ${paths.join(', ')}`)

      // Wrapping the revalidation to avoid revalidating during render.
      // This avoids the following error on job execution:
      // Route /admin/[[...segments]] used \"revalidatePath /fi/kiltajarjestys\" during render which is unsupported.
      // To ensure revalidation is performed consistently it must always happen outside of renders and cached functions.
      // See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering
      after(async () => {
        paths.forEach((path) => {
          revalidatePath(path)
        })
        revalidateTag('sitemap')
      })
    }

    // If the page was previously published, we need to revalidate the old path
    if (wasPublished && !isPublished && isPage) {
      const page = previousDoc as unknown as Page
      const oldPaths = routing.locales.map((locale) => `/${locale}/${page.path}`)

      payload.logger.info(`[Page changed] Revalidating old page at paths: ${oldPaths.join(', ')}`)

      // Same as the above revalidation.
      after(async () => {
        oldPaths.forEach((path) => {
          revalidatePath(path)
        })
        revalidateTag('sitemap')
      })
    }

    // TODO: This is a hack to revalidate all pages when a non-page collection is updated.
    // This should be improved in the future.
    if (!isPage) {
      const path = '/(frontend)/[locale]'

      payload.logger.info(`[Collection changed] Revalidating all pages at path: ${path}`)

      // Same as above.
      after(async () => {
        // Collection specific revalidation.
        switch (collectionSlug) {
          case 'redirects':
            revalidateTag('redirects')
        }

        revalidatePath(path, 'layout')
        revalidateTag('sitemap')
      })
    }
  }
}
