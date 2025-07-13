import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import type { FuksiYearBlock as FuksiYearBlockType, Media } from '@/payload-types'

interface FuksiYearProps {
  block: FuksiYearBlockType
}

export const FuksiYear = async ({ block }: FuksiYearProps) => {
  const t = await getTranslations()

  if (!block.fuksiGroups) {
    return null
  }

  return (
    <div className="prose-img:my-0">
      {block.fuksiGroups.map((group) => {
        if (typeof group === 'number') {
          return null
        }

        return (
          <div key={group.id} className="bg-fk-white rounded-lg">
            <div className="mb-6 text-2xl font-bold">{group.name}</div>
            <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {group.fuksis.map((fuksi) => {
                if (typeof fuksi === 'number') return null

                return (
                  <div key={fuksi.id} className="text-center">
                    <div className="relative mb-4 aspect-[2/3]">
                      {fuksi.photo ? (
                        <Image
                          src={(fuksi.photo as Media).url || ''}
                          alt={(fuksi.photo as Media).alt || fuksi.name || ''}
                          blurDataURL={(fuksi.photo as Media).blurDataUrl}
                          placeholder="blur"
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                          className="rounded-lg object-cover"
                        />
                      ) : block.defaultImage ? (
                        <Image
                          src={(block.defaultImage as Media).url || ''}
                          alt={(block.defaultImage as Media).alt || t('common.defaultImage')}
                          blurDataURL={(block.defaultImage as Media).blurDataUrl}
                          placeholder="blur"
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="bg-fk-gray-lightest flex h-full w-full items-center justify-center rounded-lg">
                          <span className="text-fk-gray-light">{t('common.noImage')}</span>
                        </div>
                      )}
                    </div>
                    <span className="font-semibold">{fuksi.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
