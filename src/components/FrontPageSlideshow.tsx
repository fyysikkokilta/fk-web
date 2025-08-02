'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { LandingPage, Media } from '@/payload-types'

interface FrontPageSlideshowProps {
  page: LandingPage
  startingIndex: number
}

export function FrontPageSlideshow({ page, startingIndex }: FrontPageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(startingIndex)

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
    <section className="relative z-0 mb-8 h-[calc(50svh)] w-full">
      {page.bannerImages.map((image, index) => (
        <div
          key={(image as Media).id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            priority={index === startingIndex}
            src={(image as Media).url || ''}
            alt={(image as Media).alt || ''}
            blurDataURL={(image as Media).blurDataUrl}
            placeholder="blur"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}
    </section>
  )
}
