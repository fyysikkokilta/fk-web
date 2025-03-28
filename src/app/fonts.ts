import { Lora, Source_Sans_3 } from 'next/font/google'

export const lora = Lora({
  weight: ['700'],
  display: 'swap',
  subsets: ['latin-ext', 'latin'],
  preload: true,
  variable: '--font-lora'
})

export const sourceSans3 = Source_Sans_3({
  weight: ['400', '700'],
  display: 'swap',
  subsets: ['latin-ext', 'latin'],
  preload: true,
  variable: '--font-source-sans-3'
})
