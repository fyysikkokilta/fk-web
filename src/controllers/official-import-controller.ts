import { revalidatePath } from 'next/cache'
import { PayloadHandler, PayloadRequest } from 'payload'

import { signedIn } from '@/access/signed-in'
import { Official, OfficialRole } from '@/payload-types'
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

  // Don't revalidate on each mutation
  req.context.skipRevalidate = true

  try {
    // Get existing data
    const existingDivisions = await req.payload.find({
      collection: 'divisions',
      where: {},
      limit: 0,
      locale: 'fi',
      req
    })

    const existingOfficialRoles = await req.payload.find({
      collection: 'official-roles',
      where: {},
      limit: 0,
      locale: 'fi',
      req
    })

    const existingOfficials = await req.payload.find({
      collection: 'officials',
      where: {},
      limit: 0,
      locale: 'fi',
      req
    })

    // Create a map of existing officials by name for quick lookup
    const existingOfficialsMap = new Map(
      existingOfficials.docs.map((official) => [official.name, official])
    )

    // Create a map of existing official roles by name for quick lookup
    const existingOfficialRolesMap = new Map(
      existingOfficialRoles.docs.map((role) => [role.name, role])
    )

    // Create a map of existing divisions by name for quick lookup
    const existingDivisionsMap = new Map(
      existingDivisions.docs.map((division) => [division.name, division])
    )

    // Process officials - update existing ones and create new ones
    const officialsToProcess = Array.from(
      new Set(
        divisions.flatMap((division) =>
          division.officialRoles.flatMap((officialRole) =>
            officialRole.officials.map((official) => official)
          )
        )
      )
    )

    const processedOfficials = new Map<string, Official>()

    for (const officialName of officialsToProcess) {
      const slugifiedNames = getNameSlugs(officialName)
      const photoResult = await req.payload.find({
        collection: 'media',
        where: {
          or: slugifiedNames.map((slugifiedName) => ({ filename: { contains: slugifiedName } }))
        },
        sort: '-createdAt',
        limit: 1,
        req
      })

      const photo = photoResult.docs[0]

      if (existingOfficialsMap.has(officialName)) {
        // Update existing official with new photo
        const existingOfficial = existingOfficialsMap.get(officialName)!
        const updatedOfficial = await req.payload.update({
          collection: 'officials',
          id: existingOfficial.id,
          data: {
            photo
          },
          req
        })
        processedOfficials.set(officialName, updatedOfficial)
      } else {
        // Create new official
        const newOfficial = await req.payload.create({
          collection: 'officials',
          data: {
            name: officialName,
            photo
          },
          req
        })
        processedOfficials.set(officialName, newOfficial)
      }
    }

    // Process official roles - update existing ones and create new ones
    const processedOfficialRoles = new Map<string, OfficialRole>()

    for (const division of divisions) {
      for (const officialRole of division.officialRoles) {
        const officials = officialRole.officials
          .map((officialName) => processedOfficials.get(officialName))
          .filter((official) => !!official)

        const existingRole = existingOfficialRolesMap.get(officialRole.name)
        if (existingRole) {
          // Update existing official role by updating the English name and officials
          const updatedRole = await req.payload.update({
            collection: 'official-roles',
            id: existingRole.id,
            data: {
              officials,
              name: officialRole.nameEn
            },
            locale: 'en',
            req
          })

          processedOfficialRoles.set(officialRole.name, updatedRole)
        } else {
          // Create new official role
          const newRole = await req.payload.create({
            collection: 'official-roles',
            data: {
              name: officialRole.name,
              officials
            },
            locale: 'fi',
            req
          })

          // Add English name
          const updatedRole = await req.payload.update({
            collection: 'official-roles',
            id: newRole.id,
            data: {
              name: officialRole.nameEn
            },
            locale: 'en',
            req
          })

          processedOfficialRoles.set(officialRole.name, updatedRole)
        }
      }
    }

    // Process divisions - update existing ones and create new ones
    for (const division of divisions) {
      const officialRoles = division.officialRoles
        .map((role) => processedOfficialRoles.get(role.name))
        .filter((role) => !!role)

      const existingDivision = existingDivisionsMap.get(division.name)
      if (existingDivision) {
        // Update existing division by updating the English name and official roles
        await req.payload.update({
          collection: 'divisions',
          id: existingDivision.id,
          data: {
            name: division.nameEn,
            officialRoles
          },
          locale: 'en',
          req
        })
      } else {
        // Create new division
        const newDivision = await req.payload.create({
          collection: 'divisions',
          data: {
            name: division.name,
            officialRoles
          },
          locale: 'fi',
          req
        })

        // Add English name
        await req.payload.update({
          collection: 'divisions',
          id: newDivision.id,
          data: {
            name: division.nameEn
          },
          locale: 'en',
          req
        })
      }
    }

    // Delete divisions that are no longer present in the new data
    const newDivisionNames = new Set(divisions.map((d) => d.name))
    const divisionsToDelete = existingDivisions.docs
      .filter((division) => !newDivisionNames.has(division.name))
      .map((division) => division.id)

    if (divisionsToDelete.length > 0) {
      await req.payload.delete({
        collection: 'divisions',
        where: {
          id: {
            in: divisionsToDelete
          }
        },
        req
      })
    }

    // Delete official roles that are no longer present in the new data
    const newOfficialRoleNames = new Set(
      divisions.flatMap((d) => d.officialRoles.map((r) => r.name))
    )
    const officialRolesToDelete = existingOfficialRoles.docs
      .filter((role) => !newOfficialRoleNames.has(role.name))
      .map((role) => role.id)

    if (officialRolesToDelete.length > 0) {
      await req.payload.delete({
        collection: 'official-roles',
        where: {
          id: {
            in: officialRolesToDelete
          }
        },
        req
      })
    }

    // Delete officials that are no longer present in the new data
    const newOfficialNames = new Set(officialsToProcess)
    const officialsToDelete = existingOfficials.docs
      .filter((official) => !newOfficialNames.has(official.name))
      .map((official) => official.id)

    if (officialsToDelete.length > 0) {
      await req.payload.delete({
        collection: 'officials',
        where: {
          id: {
            in: officialsToDelete
          }
        },
        req
      })
    }

    // Revalidate all pages
    req.payload.logger.info(
      `[Official import] Revalidating all pages at path: /(frontend)/[locale]`
    )
    revalidatePath('/(frontend)/[locale]', 'layout')

    return Response.json({ message: 'Divisions and official roles updated' }, { status: 200 })
  } catch (error) {
    return Response.json(
      { error: `Failed to update divisions and official roles: ${error}` },
      { status: 500 }
    )
  }
}
