'use client'

import { Form } from '@base-ui/react/form'
import { Loader } from 'lucide-react'
import { Locale, useTranslations } from 'next-intl'
import React, { useState } from 'react'

import { RichText } from '@/components/RichText/BlockRichText'
import { useRouter } from '@/i18n/navigation'
import type { FormBlock as FormBlockType } from '@/payload-types'

import { Checkbox } from './Checkbox'
import { Date } from './Date'
import { Email } from './Email'
import { Message } from './Message'
import { Number } from './Number'
import { Radio } from './Radio'
import { Select } from './Select'
import { Text } from './Text'
import { Textarea } from './Textarea'

interface FormBlockProps {
  block: FormBlockType
  locale: Locale
}

export const FormBlock = ({ block, locale }: FormBlockProps) => {
  const t = useTranslations()
  const { enableIntro, form, introContent } = block

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<{ message: string; status?: string }>()
  const router = useRouter()

  if (!form || typeof form !== 'object') {
    return null
  }

  const { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = form

  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(undefined)

    const formData = new FormData(event.currentTarget)
    const data: Record<string, unknown> = {}

    for (const [name, value] of formData.entries()) {
      data[name] = value
    }

    const dataToSend = Object.entries(data).map(([name, value]) => ({
      field: name,
      value
    }))

    const loadingTimerID = setTimeout(() => {
      setIsLoading(true)
    }, 1000)

    try {
      const req = await fetch(`/api/form-submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          form: formID,
          submissionData: dataToSend
        })
      })

      const res = await req.json()
      clearTimeout(loadingTimerID)

      if (req.status >= 400) {
        setIsLoading(false)
        setError({
          message: res.errors?.[0]?.message || t('form.error'),
          status: res.status
        })
        return
      }

      setIsLoading(false)
      setHasSubmitted(true)

      if (confirmationType === 'redirect' && redirect?.url) {
        router.push(redirect.url)
      }
    } catch (err) {
      console.warn(err)
      clearTimeout(loadingTimerID)
      setIsLoading(false)
      setError({
        message: t('form.error')
      })
    }
  }

  return (
    <div className="bg-fk-white border-fk-gray-lightest mx-auto my-8 w-full max-w-3xl rounded-xl border p-8 shadow-lg">
      {enableIntro && introContent && !hasSubmitted && (
        <div className="mb-6 max-w-none">
          <RichText data={introContent} locale={locale} />
        </div>
      )}

      {/* Live region for form status announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isLoading && t('form.loading')}
        {hasSubmitted && confirmationType === 'message' && t('form.success')}
        {error && `${error.status || '500'}: ${error.message || ''}`}
      </div>

      {confirmationMessage && !isLoading && hasSubmitted && confirmationType === 'message' && (
        <div className="bg-fk-green-light text-fk-black mb-6 rounded-md p-4" role="alert">
          <RichText data={confirmationMessage} locale={locale} />
        </div>
      )}
      {isLoading && !hasSubmitted && (
        <div
          id="loading-status"
          className="bg-fk-blue-light text-fk-black mb-6 flex items-center justify-center rounded-md p-4"
          role="status"
          aria-live="polite"
        >
          <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
          <span>{t('form.loading')}</span>
        </div>
      )}
      {error && (
        <div className="bg-fk-red-light text-fk-white mb-6 rounded-md p-4" role="alert">
          <p className="font-medium">{`${error.status || '500'}: ${error.message || ''}`}</p>
        </div>
      )}
      {!hasSubmitted && (
        <Form
          id={formID.toString()}
          onSubmit={onSubmit}
          className="space-y-6"
          aria-label={form.title}
        >
          <div className="grid grid-cols-1 gap-6">
            {form.fields?.map((field, index: number) => {
              switch (field.blockType) {
                case 'checkbox':
                  return <Checkbox key={field.id ?? index} {...field} />
                case 'date':
                  return <Date key={field.id ?? index} {...field} />
                case 'email':
                  return <Email key={field.id ?? index} {...field} />
                case 'message':
                  return <Message key={field.id ?? index} {...field} locale={locale} />
                case 'number':
                  return <Number key={field.id ?? index} {...field} />
                case 'radio':
                  return <Radio key={field.id ?? index} {...field} />
                case 'select':
                  return <Select key={field.id ?? index} {...field} />
                case 'text':
                  return <Text key={field.id ?? index} {...field} />
                case 'textarea':
                  return <Textarea key={field.id ?? index} {...field} />
                default:
                  throw field satisfies never
              }
            })}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-fk-yellow text-fk-black hover:bg-fk-yellow-dark cursor-pointer rounded-lg px-8 py-3 font-semibold shadow-md transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
              aria-describedby={isLoading ? 'loading-status' : undefined}
            >
              {submitButtonLabel || t('form.submit')}
            </button>
          </div>
        </Form>
      )}
    </div>
  )
}
