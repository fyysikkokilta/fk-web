import { PayloadHandler, PayloadRequest } from 'payload'

import { signedIn } from '@/access/signed-in'

export const officialImportController: PayloadHandler = async (req: PayloadRequest) => {
  if (!signedIn({ req })) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { year, divisions } = (await req.json?.()) as {
    year: number
    divisions: {
      name: string
      officialRoles: {
        name: string
        officials: string[]
      }[]
    }[]
  }

  try {
    // Delete etnries from the year that is being imported
    await req.payload.delete({
      collection: 'officials',
      where: { year: { equals: year } },
      req
    })

    await req.payload.delete({
      collection: 'official-roles',
      where: { year: { equals: year } },
      req
    })

    await req.payload.delete({
      collection: 'divisions',
      where: { year: { equals: year } },
      req
    })

    const officialsToCreate = Array.from(
      new Set(
        divisions.flatMap((division) =>
          division.officialRoles.flatMap((officialRole) =>
            officialRole.officials.map((official) => official)
          )
        )
      )
    )

    const officialPromises = officialsToCreate.map(async (name) => {
      const slugifiedName = [name, name.replace(/ /g, '_'), name.replace(/ /g, '-')]
      const photoResult = await req.payload.find({
        collection: 'media',
        where: {
          or: slugifiedName.map((slugifiedName) => ({ filename: { equals: slugifiedName } }))
        },
        // Assume the photo wanted is the most recent one
        // Further modifications can be done by the user in the UI
        sort: '-createdAt',
        limit: 1,
        req
      })

      const photo = photoResult.docs[0]

      return req.payload.create({
        collection: 'officials',
        data: {
          name,
          year,
          photo
        },
        locale: 'fi',
        req
      })
    })

    const createdOfficials = await Promise.all(officialPromises)

    divisions.forEach(async (division) => {
      const createdOfficialRoles = await Promise.all(
        division.officialRoles.map(async (officialRole) => {
          const translationResult = await req.payload.find({
            collection: 'translations',
            where: { translation: { equals: officialRole.name }, type: { equals: 'officialRole' } },
            locale: 'fi',
            req
          })

          let translation = translationResult.docs[0]

          if (!translation) {
            translation = await req.payload.create({
              collection: 'translations',
              data: { translation: officialRole.name, type: 'officialRole' },
              locale: 'fi',
              req
            })
          }

          return req.payload.create({
            collection: 'official-roles',
            data: {
              name: translation,
              year,
              officials: officialRole.officials.map(
                (official) => createdOfficials.find((o) => o.name === official)!
              )
            },
            locale: 'fi',
            req
          })
        })
      )

      const translationResult = await req.payload.find({
        collection: 'translations',
        where: { translation: { equals: division.name }, type: { equals: 'division' } },
        locale: 'fi',
        req
      })

      let translation = translationResult.docs[0]

      if (!translation) {
        translation = await req.payload.create({
          collection: 'translations',
          data: { translation: division.name, type: 'division' },
          locale: 'fi',
          req
        })
      }

      await req.payload.create({
        collection: 'divisions',
        data: {
          name: translation,
          year,
          officialRoles: createdOfficialRoles
        },
        locale: 'fi',
        req
      })
    })

    return Response.json({ message: 'Divisions and official roles created' }, { status: 200 })
  } catch (error) {
    return Response.json(
      { error: `Failed to create divisions and official roles: ${error}` },
      { status: 500 }
    )
  }
}
