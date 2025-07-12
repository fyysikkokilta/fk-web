import Image from 'next/image'

import type { CommitteeBlock as CommitteeBlockType, Media } from '@/payload-types'

interface CommitteeProps {
  block: CommitteeBlockType
}

export const Committee = ({ block }: CommitteeProps) => {
  const { officialRole } = block

  if (typeof officialRole !== 'object') {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Role title */}
      <h2 className="text-center text-2xl font-bold">{officialRole.name}</h2>

      {/* Officials grid */}
      <div className="grid grid-cols-2 items-baseline justify-center gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {officialRole.officials?.map((official) => {
          if (typeof official === 'number') {
            return null
          }

          return (
            <div key={official.id} className="flex flex-col overflow-hidden p-4 text-center">
              {/* Oval-shaped image container */}
              <div className="prose-img:my-0 relative mb-4 aspect-[2/3] overflow-hidden rounded-[50%]">
                {official.photo ? (
                  <Image
                    src={(official.photo as Media).url!}
                    alt={official.name}
                    blurDataURL={(official.photo as Media).blurDataUrl}
                    placeholder="blur"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-fk-gray-lightest flex h-full w-full items-center justify-center">
                    <span className="text-fk-gray-light">{'No image'}</span>
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
