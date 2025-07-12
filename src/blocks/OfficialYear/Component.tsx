import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import type {
  Division as DivisionType,
  Media,
  Official as OfficialType,
  OfficialRole as OfficialRoleType,
  OfficialYearBlock as OfficialYearBlockType
} from '@/payload-types'

interface OfficialYearProps {
  block: OfficialYearBlockType
}

interface OfficialWithRoles {
  official: OfficialType
  roles: OfficialRoleType[]
}

export const OfficialYear = async ({ block }: OfficialYearProps) => {
  const t = await getTranslations()

  const getOfficialsWithRoles = (division: DivisionType) => {
    const officialsMap = new Map<number, OfficialWithRoles>()

    // Process each role and its officials
    division.officialRoles?.forEach((role) => {
      if (typeof role !== 'object') return
      if (!role?.officials) return

      role.officials.forEach((official) => {
        if (typeof official !== 'object') return
        if (!official?.id) return

        if (officialsMap.has(official.id)) {
          const existingEntry = officialsMap.get(official.id)
          if (existingEntry) {
            existingEntry.roles.push(role)
          }
        } else {
          officialsMap.set(official.id, {
            official,
            roles: [role]
          })
        }
      })
    })

    // Sort officials by their first role's name
    return Array.from(officialsMap.values())
  }

  if (!block.divisions) {
    return null
  }

  const officialCellsToShow = block.divisions
    ?.map(({ division, backgroundColor, textColor }) => {
      if (typeof division !== 'object') return []
      return [
        {
          backgroundColor,
          textColor,
          title: division.name
        },
        ...getOfficialsWithRoles(division).map((official) => ({
          ...official,
          backgroundColor,
          textColor
        }))
      ]
    })
    .flat()

  return (
    <div className="prose-h2:no-underline prose-img:my-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {officialCellsToShow.map((cell) => {
        const isOfficial = 'official' in cell

        if (isOfficial) {
          const { official, roles } = cell
          return (
            <div
              key={`${official.id}-${roles.map((role) => role.id).join('-')}`}
              className="flex flex-col overflow-hidden"
              style={{
                backgroundColor: cell.backgroundColor,
                color: cell.textColor
              }}
            >
              <div className="relative m-5 aspect-[4/5]">
                {official.photo ? (
                  <Image
                    src={(official.photo as Media)?.url || ''}
                    alt={official.name || ''}
                    blurDataURL={(official.photo as Media).blurDataUrl}
                    placeholder="blur"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover"
                  />
                ) : block.defaultImage ? (
                  <Image
                    src={(block.defaultImage as Media).url || ''}
                    alt={(block.defaultImage as Media).alt || t('common.defaultImage')}
                    blurDataURL={(block.defaultImage as Media).blurDataUrl}
                    placeholder="blur"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-fk-gray-lightest flex h-full w-full items-center justify-center">
                    <span className="text-fk-gray-light">{t('common.noImage')}</span>
                  </div>
                )}
              </div>
              <div className="pb-5 text-center">
                <span className="mb-1 text-lg font-semibold" style={{ color: cell.textColor }}>
                  {official.name}
                </span>
                <div className="px-2 text-sm opacity-90" style={{ color: cell.textColor }}>
                  {roles
                    .sort((a, b) => {
                      return a.name.localeCompare(b.name)
                    })
                    .map((role) => role.name || '')
                    .filter(Boolean)
                    .join(', ')}
                </div>
              </div>
            </div>
          )
        }

        return (
          <div key={cell.title} className="p-4" style={{ backgroundColor: cell.backgroundColor }}>
            <h2
              className="flex h-full items-center text-xl font-bold"
              style={{ color: cell.textColor }}
            >
              {cell.title}
            </h2>
          </div>
        )
      })}
    </div>
  )
}
