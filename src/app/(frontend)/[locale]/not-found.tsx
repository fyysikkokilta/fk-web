import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'

// If the provided locale is not found, redirect to the default locale
export default async function NotFound() {
  const t = await getTranslations()

  return (
    <div className="relative flex h-screen min-h-dvh w-full items-center justify-center overflow-hidden">
      {/* Background logo */}
      <Image
        src="../fii_2.svg"
        alt={t('notFound.logoAlt')}
        className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-30 select-none"
        fill
      />
      <div className="bg-fk-black relative z-10 flex flex-col items-center rounded-xl p-8 text-center shadow-xl">
        <h2 className="text-fk-yellow mb-4 animate-bounce text-4xl font-extrabold drop-shadow-lg">
          {t('notFound.title')}
        </h2>
        <p className="text-fk-white mb-6 max-w-xl text-lg font-medium md:text-2xl">
          {t('notFound.description')}
        </p>
        <p className="text-fk-gray-light mt-4 text-xl italic">{t('notFound.subtitle')}</p>
        <Link
          href="/"
          className="bg-fk-yellow text-fk-black hover:bg-fk-yellow-dark mt-8 inline-block rounded-full px-6 py-3 font-bold shadow transition"
        >
          {t('notFound.goHome')}
        </Link>
      </div>
    </div>
  )
}
