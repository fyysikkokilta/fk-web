'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

import { Link } from '@/i18n/navigation'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('globalError')

  useEffect(() => {
    // Log error for debugging
    console.error('Error:', error)
  }, [error])

  return (
    <div className="relative flex h-screen min-h-dvh w-full items-center justify-center overflow-hidden">
      {/* Background logo */}
      <Image
        src="/fii_2.svg"
        alt={t('logoAlt')}
        className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-30 select-none"
        fill
        unoptimized
      />
      <div className="bg-fk-black relative flex flex-col items-center rounded-xl p-8 text-center shadow-xl">
        <h2 className="text-fk-yellow mb-4 text-4xl font-extrabold drop-shadow-lg">{t('title')}</h2>
        <p className="text-fk-white mb-4 max-w-xl text-lg font-medium">{t('description')}</p>
        <p className="text-fk-white mb-6 max-w-xl text-base">{t('contactInfo')}</p>
        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="bg-fk-yellow text-fk-black hover:bg-fk-yellow-dark mt-4 inline-block rounded-full px-6 py-3 font-bold shadow transition"
          >
            {t('tryAgain')}
          </button>
          <Link
            href="/"
            className="bg-fk-yellow text-fk-black hover:bg-fk-yellow-dark mt-4 inline-block rounded-full px-6 py-3 font-bold shadow transition"
          >
            {t('goHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}
