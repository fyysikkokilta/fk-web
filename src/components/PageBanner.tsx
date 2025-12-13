import Image from 'next/image'

import type { Page } from '@/payload-types'

interface PageBannerProps {
  page: Page
}

export const PageBanner = ({ page }: PageBannerProps) => {
  const image = page.bannerImage

  if (!image || typeof image !== 'object') {
    return null
  }

  return (
    <section className="relative mb-8 h-[calc(30svh)] w-full">
      <Image
        priority
        src={image.url || ''}
        alt={image.alt || page.title}
        blurDataURL={image.blurDataUrl}
        placeholder="blur"
        fill
        unoptimized
        sizes="100vw"
        className="object-cover"
      />
    </section>
  )
}
