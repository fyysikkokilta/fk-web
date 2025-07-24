import { PayloadHandler, PayloadRequest } from 'payload'

import { signedIn } from '@/access/signed-in'
import { getNameSlugs } from '@/utils/getNameSlugs'

export const officialImportController: PayloadHandler = async (req: PayloadRequest) => {
  if (!signedIn({ req })) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { divisions } = (await req.json?.()) as {
    divisions: {
      name: string
      nameEn: string
      officialRoles: {
        name: string
        nameEn: string
        officials: string[]
      }[]
    }[]
  }

  try {
    // Delete previous entries
    await req.payload.delete({
      collection: 'officials',
      where: {},
      req
    })

    await req.payload.delete({
      collection: 'official-roles',
      where: {},
      req
    })

    await req.payload.delete({
      collection: 'divisions',
      where: {},
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
      const slugifiedNames = getNameSlugs(name)
      const photoResult = await req.payload.find({
        collection: 'media',
        where: {
          or: slugifiedNames.map((slugifiedName) => ({ filename: { contains: slugifiedName } }))
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
          const createdOfficialRole = await req.payload.create({
            collection: 'official-roles',
            data: {
              name: officialRole.name,
              officials: officialRole.officials.map(
                (official) => createdOfficials.find((o) => o.name === official)!
              )
            },
            locale: 'fi',
            req
          })

          await req.payload.update({
            collection: 'official-roles',
            id: createdOfficialRole.id,
            data: {
              name: officialRole.nameEn
            },
            locale: 'en',
            req
          })

          return createdOfficialRole
        })
      )

      const createdDivision = await req.payload.create({
        collection: 'divisions',
        data: {
          name: division.name,
          officialRoles: createdOfficialRoles
        },
        locale: 'fi',
        req
      })

      await req.payload.update({
        collection: 'divisions',
        id: createdDivision.id,
        data: {
          name: division.nameEn
        },
        locale: 'en',
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
