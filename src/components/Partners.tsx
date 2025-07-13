import Image from 'next/image'

import { Link } from '@/i18n/navigation'
import type { Media, PartnerSection } from '@/payload-types'

interface PartnersProps {
  partnerData: PartnerSection
}

export const Partners = ({ partnerData }: PartnersProps) => {
  return (
    <section className="bg-fk-gray text-fk-white w-full py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center text-5xl font-bold">{partnerData.title}</div>
        <div className="grid grid-cols-1 items-center justify-items-center gap-y-12 sm:grid-cols-2 md:grid-cols-3">
          {partnerData.partners?.map(({ name, link, logo, id }) => (
            <Link
              key={id}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative h-[100px] w-full max-w-[200px]"
            >
              <Image
                src={(logo as Media).url || ''}
                alt={(logo as Media).alt || name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="scale-150 object-contain transition-transform duration-200 hover:scale-200"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
