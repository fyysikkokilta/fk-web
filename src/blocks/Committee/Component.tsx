import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import type { CommitteeBlock as CommitteeBlockType } from '@/payload-types'

interface CommitteeProps {
  block: CommitteeBlockType
}

export const Committee = async ({ block }: CommitteeProps) => {
  const t = await getTranslations()
  const { officialRole, defaultImage } = block

  if (typeof officialRole !== 'object') {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Role title */}
      <div className="text-center text-2xl font-bold">{officialRole.name}</div>

      {/* Officials grid */}
      <div className="grid grid-cols-2 justify-center gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {officialRole.officials?.map((official) => {
          if (typeof official === 'number') {
            return null
          }

          return (
            <div key={official.id} className="flex flex-col overflow-hidden p-4 text-center">
              {/* Oval-shaped image container */}
              <div className="not-prose relative mb-4 aspect-2/3 overflow-hidden rounded-[50%]">
                {typeof official.photo === 'object' && official.photo && official.photo.url ? (
                  <Image
                    src={official.photo.url}
                    alt={official.name}
                    blurDataURL={official.photo.blurDataUrl}
                    placeholder="blur"
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover"
                  />
                ) : typeof defaultImage === 'object' && defaultImage && defaultImage.url ? (
                  <Image
                    src={defaultImage.url}
                    alt={defaultImage.alt || t('common.defaultImage')}
                    blurDataURL={defaultImage.blurDataUrl}
                    placeholder="blur"
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-fk-gray-lightest flex h-full w-full items-center justify-center">
                    <span className="text-fk-gray-light">{t('common.noImage')}</span>
                  </div>
                )}
              </div>

              {/* Name */}
              <span className="mb-2 text-lg font-semibold">{official.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
