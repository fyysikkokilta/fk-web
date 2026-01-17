import { revalidatePath } from 'next/cache'
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
  return async ({ doc, req: { payload, context }, operation }) => {
    // Don't revalidate if the skipRevalidate flag is set
    if (context.skipRevalidate) {
      return
    }

    const isPage = collectionSlug === 'pages'

    if (isPage) {
      const page = doc as unknown as Page
      let paths: string[] = []

      if (operation === 'create') {
        // If the page is created now, we only have one locale created here
        // so we can just use the path from the doc.
        paths = routing.locales.map((locale) => `/${locale}/${page.path}`)
      } else {
        // Get the page with all locales
        // This is needed to construct all paths for all locales.
        const pageWithAllLocales = await payload.findByID({
          collection: 'pages',
          id: page.id,
          depth: 1,
          locale: 'all'
        })
        const localizedPaths = pageWithAllLocales.path as unknown as Record<string, string>
        const pathValues = Object.values(localizedPaths)
        paths = routing.locales
          .map((locale) => {
            return pathValues.map((path) => `/${locale}/${path}`)
          })
          .flat()
      }

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
      })
    }

    // This is a hack to revalidate all pages when a non-page collection is updated.
    // This should be improved in the future.
    // Pages don't need to be revalidated when a non-page collection is created.
    if (!isPage && operation !== 'create') {
      const path = '/(frontend)/[locale]'

      payload.logger.info(`[Collection changed] Revalidating all pages at path: ${path}`)

      // Same as above.
      after(async () => {
        revalidatePath(path, 'layout')
      })
    }

    const collectionSpecificRevalidation: CollectionSlug[] = []

    if (collectionSpecificRevalidation.includes(collectionSlug)) {
      payload.logger.info(`[Collection changed] Revalidating ${collectionSlug}`)

      after(async () => {
        // Collection specific revalidation.
        switch (collectionSlug) {
        }
      })
    }
  }
}
