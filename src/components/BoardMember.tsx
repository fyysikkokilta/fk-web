import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import type { BoardMember as BoardMemberType } from '@/payload-types'

interface BoardMemberProps {
  member: BoardMemberType
}

export const BoardMember = async ({ member }: BoardMemberProps) => {
  const t = await getTranslations()
  return (
    <div className="flex flex-col p-4 text-center">
      {/* Oval-shaped image container */}
      <div className="not-prose relative mb-4 aspect-[2/3] overflow-hidden rounded-[50%]">
        {typeof member.image === 'object' && member.image && member.image.url ? (
          <Image
            src={member.image.url}
            alt={member.image.alt || member.name}
            blurDataURL={member.image.blurDataUrl}
            placeholder="blur"
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="bg-fk-gray-lightest absolute inset-0 flex items-center justify-center">
            <p className="text-fk-gray-light">{t('common.noImage')}</p>
          </div>
        )}
      </div>

      {/* Title */}
      <span className="mb-2 text-xl font-semibold italic">{member.role}</span>

      {/* Name */}
      <span className="mb-2 text-lg">{member.name}</span>

      {/* Contact information */}
      <div className="space-y-1 text-sm font-bold">
        <a
          href={`mailto:${member.email}`}
          className="text-fk-orange-dark hover:text-fk-orange block font-bold underline decoration-2 underline-offset-2 hover:decoration-3"
        >
          {member.email}
        </a>
        {member.telegram && (
          <a
            href={`https://t.me/${member.telegram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fk-gray-light block hover:underline"
          >
            {`@${member.telegram.replace('@', '')}`}
          </a>
        )}
        {member.phone && (
          <a href={`tel:${member.phone}`} className="text-fk-gray-light block hover:underline">
            {member.phone}
          </a>
        )}
      </div>
    </div>
  )
}
