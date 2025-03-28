import { Link } from '@/i18n/navigation'
import type { Page, PageNavigationBlock as PageNavigationBlockType } from '@/payload-types'

interface PageNavigationProps {
  block: PageNavigationBlockType
}

export const PageNavigation = ({ block }: PageNavigationProps) => {
  const { pageNavigation, style } = block

  if (typeof pageNavigation === 'number') {
    return null
  }

  const renderPage = (page: Page, label: string) => {
    if (typeof page === 'string' || typeof page === 'number') {
      return null
    }

    return <Link href={`/${page.path}`}>{label}</Link>
  }

  if (style === 'links') {
    return (
      <nav className="list-disc pl-4">
        <ul>
          {pageNavigation.pages?.map(
            ({ page, label }) =>
              typeof page === 'object' && <li key={page.id}>{renderPage(page, label)}</li>
          )}
        </ul>
      </nav>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {pageNavigation.pages?.map(
        ({ page, label }) =>
          typeof page === 'object' && (
            <Link
              key={page.id}
              href={`/${page.path}`}
              className="bg-fk-orange hover:bg-fk-red text-fk-white flex aspect-square items-center justify-center px-4 py-2 text-center text-3xl font-bold transition-colors duration-200 hover:scale-120"
            >
              {label}
            </Link>
          )
      )}
    </div>
  )
}
