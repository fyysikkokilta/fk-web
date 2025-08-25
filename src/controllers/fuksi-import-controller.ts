import { revalidatePath } from 'next/cache'
import { PayloadHandler, PayloadRequest } from 'payload'

import { signedIn } from '@/access/signed-in'
import { getNameSlugs } from '@/utils/getNameSlugs'

export const fuksiImportController: PayloadHandler = async (req: PayloadRequest) => {
  if (!signedIn({ req })) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { year, groups } = (await req.json?.()) as {
    year: number
    groups: {
      name: string
      fuksis: string[]
    }[]
  }

  // Don't revalidate on each mutation
  req.context.skipRevalidate = true

  try {
    await req.payload.delete({
      collection: 'fuksi-groups',
      where: { year: { equals: year } },
      req
    })

    await req.payload.delete({
      collection: 'fuksis',
      where: { year: { equals: year } },
      req
    })

    await Promise.all(
      groups.map(async (group) => {
        const createdFuksis = await Promise.all(
          group.fuksis.map(async (name) => {
            const slugifiedNames = getNameSlugs(name)
            const photoResult = await req.payload.find({
              collection: 'media',
              where: {
                or: slugifiedNames.map((slugifiedName) => ({
                  filename: { contains: slugifiedName }
                }))
              },
              // Assume the photo wanted is the most recent one
              // Further modifications can be done by the user in the UI
              sort: '-createdAt',
              limit: 1,
              req
            })

            const photo = photoResult.docs[0]

            return req.payload.create({
              collection: 'fuksis',
              data: {
                name,
                year,
                photo
              },
              req
            })
          })
        )

        return req.payload.create({
          collection: 'fuksi-groups',
          data: {
            name: group.name,
            year,
            fuksis: createdFuksis
          },
          req
        })
      })
    )

    // Revalidate all pages
    req.payload.logger.info(`[Fuksi import] Revalidating all pages at path: /(frontend)/[locale]`)
    revalidatePath('/(frontend)/[locale]', 'layout')

    return Response.json({ message: 'Fuksi years, groups and fuksis created' }, { status: 200 })
  } catch (error) {
    return Response.json(
      { error: `Failed to create fuksi years, groups and fuksis: ${error}` },
      { status: 500 }
    )
  }
}
