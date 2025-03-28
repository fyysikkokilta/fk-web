'use client'

import { PayloadAdminBar } from '@payloadcms/admin-bar'

import { useRouter } from '@/i18n/navigation'

type DraftModeBannerProps = {
  isDraft: boolean
  pageId?: string
  hidden?: boolean | null
}

export function DraftModeBanner({ isDraft, pageId, hidden = false }: DraftModeBannerProps) {
  const router = useRouter()

  return (
    <>
      {isDraft || hidden ? (
        <div className="bg-fk-red-light text-fk-white fixed top-20 z-20 flex w-full flex-col p-2 text-center">
          {isDraft ? <span>{'This is a draft preview'}</span> : null}
          {hidden ? <span>{'This page is hidden'}</span> : null}
        </div>
      ) : null}
      <PayloadAdminBar
        className="bottom-0"
        cmsURL={process.env.NEXT_PUBLIC_SERVER_URL}
        collectionSlug="pages"
        id={pageId}
        preview={isDraft}
        onPreviewExit={async () => {
          await fetch('/api/exit-draft')
          router.refresh()
        }}
        style={{
          top: 'auto'
        }}
      />
    </>
  )
}
