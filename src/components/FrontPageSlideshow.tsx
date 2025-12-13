'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { LandingPage } from '@/payload-types'

interface FrontPageSlideshowProps {
  page: LandingPage
}

export function FrontPageSlideshow({ page }: FrontPageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (page.bannerImages?.length || 1))
    }, 10000) // Change slide every 10 seconds

    return () => clearInterval(timer)
  }, [page.bannerImages?.length])

  if (
    !page.bannerImages ||
    typeof page.bannerImages === 'number' ||
    page.bannerImages.length === 0
  ) {
    return null
  }

  return (
    <section className="relative mb-8 h-[calc(50svh)] w-full">
      {page.bannerImages.map((image, index) => {
        if (typeof image === 'number') {
          return null
        }
        return (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              priority={index === currentIndex}
              src={image.url || ''}
              alt={image.alt || ''}
              blurDataURL={image.blurDataUrl}
              placeholder="blur"
              fill
              unoptimized
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )
      })}
    </section>
  )
}
