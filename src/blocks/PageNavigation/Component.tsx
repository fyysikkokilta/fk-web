'use client'

import { Link, usePathname } from '@/i18n/navigation'
import type { PageNavigationBlock as PageNavigationBlockType } from '@/payload-types'

interface PageNavigationProps {
  block: PageNavigationBlockType
}

// Prefetches are disabled so that, for example, fuksi pages
// don't cause massive performance hits when a user goes to
// one page and the server renders ALL of them :D

export const PageNavigation = ({ block }: PageNavigationProps) => {
  const { pageNavigation, style } = block
  const pathname = usePathname()

  if (typeof pageNavigation === 'number') {
    return null
  }

  if (style === 'links') {
    return (
      <nav className="list-disc pl-4">
        <ul>
          {pageNavigation.pages?.map(
            ({ page, label }) =>
              typeof page === 'object' && (
                <li key={page.id}>
                  <Link prefetch={false} href={`/${page.path}`}>
                    {label}
                  </Link>
                </li>
              )
          )}
        </ul>
      </nav>
    )
  }

  return (
    <div className="not-prose text-fk-white my-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-6 md:grid-cols-9">
      {pageNavigation.pages?.map(
        ({ page, label }) =>
          typeof page === 'object' && (
            <Link
              key={page.id}
              href={`/${page.path}`}
              prefetch={false}
              className={`text-fk-white hover:bg-fk-orange group flex aspect-4/3 items-center justify-center text-center font-(family-name:--font-lora) font-bold transition-all duration-200 ${
                pathname.endsWith(`/${page.path}`) ? 'bg-fk-orange' : 'bg-fk-orange-dark'
              }`}
            >
              <span className="text-3xl transition-all duration-200 group-hover:text-4xl">
                {label}
              </span>
            </Link>
          )
      )}
    </div>
  )
}
