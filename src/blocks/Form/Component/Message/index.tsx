import type { Locale } from 'next-intl'
import React from 'react'

import { RichText } from '@/components/RichText/BlockRichText'
import type { Form } from '@/payload-types'

import { Width } from '../Width'

type MessageField = Extract<NonNullable<Form['fields']>[number], { blockType: 'message' }>

export const Message: React.FC<MessageField & { locale: Locale }> = ({ message, locale }) => {
  if (!message) {
    return null
  }

  return (
    <Width width={100}>
      <div className="bg-fk-gray-lightest mb-4 rounded-md p-4">
        <div className="max-w-none">
          <RichText data={message} locale={locale} />
        </div>
      </div>
    </Width>
  )
}
