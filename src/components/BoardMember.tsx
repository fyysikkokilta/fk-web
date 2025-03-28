import Image from 'next/image'

import type { BoardMember as BoardMemberType, Media } from '@/payload-types'
interface BoardMemberProps {
  member: BoardMemberType
}

export const BoardMember = ({ member }: BoardMemberProps) => (
  <div className="flex flex-col overflow-hidden p-4 text-center">
    {/* Oval-shaped image container */}
    <div className="relative mb-4 aspect-[2/3] overflow-hidden rounded-[50%]">
      <Image
        src={(member.image as Media).url!}
        alt={(member.image as Media).alt || member.name}
        blurDataURL={(member.image as Media).blurDataUrl}
        placeholder="blur"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover"
      />
    </div>

    {/* Title */}
    <span className="mb-2 text-xl font-semibold italic">{member.role}</span>

    {/* Name */}
    <span className="mb-2 text-lg">{member.name}</span>

    {/* Contact information */}
    <div className="space-y-1 text-sm font-bold">
      <a href={`mailto:${member.email}`} className="text-fk-orange block hover:underline">
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
