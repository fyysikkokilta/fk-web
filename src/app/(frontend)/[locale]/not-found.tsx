import Image from 'next/image'

import { Link } from '@/i18n/navigation'

// If the provided locale is not found, redirect to the default locale
export default function NotFound() {
  return (
    <div className="relative flex h-screen min-h-dvh w-full items-center justify-center overflow-hidden">
      {/* Background logo */}
      <Image
        src="../fii_2.svg"
        alt="Guild of Physics Logo"
        className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-30 select-none"
      />
      <div className="bg-fk-black relative z-10 flex flex-col items-center rounded-xl p-8 text-center shadow-xl">
        <h2 className="text-fk-yellow mb-4 animate-bounce text-4xl font-extrabold drop-shadow-lg">
          {"Oh Lord, it's hard to be humble..."}
        </h2>
        <p className="text-fk-white mb-6 max-w-xl text-lg font-medium md:text-2xl">
          {`When you're perfect in every way. I can't wait to look in the mirror, cause I get better lookin' each day. To know me is to love me, I must be a hell of a man. Oh Lord, it's hard to be humble, but I'm doin' the best that I can.`}
        </p>
        <p className="text-fk-gray-light mt-4 text-xl italic">
          {'But this page? Not found. Even perfection has its limits!'}
        </p>
        <Link
          href="/"
          className="bg-fk-yellow text-fk-black hover:bg-fk-yellow-dark mt-8 inline-block rounded-full px-6 py-3 font-bold shadow transition"
        >
          {'Go Home & Admire Yourself'}
        </Link>
      </div>
    </div>
  )
}
