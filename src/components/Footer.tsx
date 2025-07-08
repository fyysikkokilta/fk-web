import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { SocialIcon } from 'react-social-icons'

import { Footer as FooterType } from '@/payload-types'

import { RichText } from './RichText/BlockRichText'

interface FooterProps {
  footer: FooterType
  locale: Locale
}

export const Footer = async ({ footer, locale }: FooterProps) => {
  const t = await getTranslations()

  return (
    <footer className="bg-fk-gray w-full py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="prose-p:text-fk-white">
            <RichText data={footer.content} locale={locale} />
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {footer.socials?.map((social, index) => (
              <SocialIcon
                url={social}
                target="_blank"
                fgColor="#fbdb1d"
                bgColor="#000000"
                key={index}
              />
            ))}
          </div>
          <div className="text-fk-white text-md mt-8">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </div>
        </div>
      </div>
    </footer>
  )
}
