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
    <div className="relative z-0 mb-8 h-[calc(30svh)] w-full">
      <Image
        priority
        src={image.url || ''}
        alt={image.alt || page.title}
        blurDataURL={image.blurDataUrl}
        placeholder="blur"
        fill
        sizes="100vw"
        className="object-cover"
      />
    </div>
  )
}
