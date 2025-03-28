import { PayloadHandler, PayloadRequest } from 'payload'

import { signedIn } from '@/access/signed-in'

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
        const slugifiedName = group.name.replace(/ /g, '-')
        const photoResult = await req.payload.find({
          collection: 'media',
          where: { filename: { contains: slugifiedName } },
          // Assume the photo wanted is the most recent one
          // Further modifications can be done by the user in the UI
          sort: '-createdAt',
          limit: 1,
          req
        })

        const photo = photoResult.docs[0]

        const createdFuksis = await Promise.all(
          group.fuksis.map(async (name) => {
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

    return Response.json({ message: 'Fuksi years, groups and fuksis created' }, { status: 200 })
  } catch (error) {
    return Response.json(
      { error: `Failed to create fuksi years, groups and fuksis: ${error}` },
      { status: 500 }
    )
  }
}
