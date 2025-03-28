'use client'

import { LoaderCircle } from 'lucide-react'
import { Locale } from 'next-intl'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { RichText } from '@/components/RichText/BlockRichText'
import { useRouter } from '@/i18n/navigation'
import type { FormBlock as FormBlockType } from '@/payload-types'

import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Property | Property[] | Value
}

interface FormBlockProps {
  block: FormBlockType
  locale: Locale
}

export const FormBlock = ({ block, locale }: FormBlockProps) => {
  const { enableIntro, form, introContent } = block

  const formMethods = useForm({
    defaultValues: buildInitialFormState(typeof form === 'object' ? form.fields || [] : [])
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  if (!form || typeof form !== 'object') {
    return null
  }

  const { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = form

  const onSubmit = (data: Data) => {
    let loadingTimerID: ReturnType<typeof setTimeout>
    const submitForm = async () => {
      setError(undefined)

      const dataToSend = Object.entries(data).map(([name, value]) => ({
        field: name,
        value
      }))

      // delay loading indicator by 1s
      loadingTimerID = setTimeout(() => {
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
            message: res.errors?.[0]?.message || 'Internal Server Error',
            status: res.status
          })

          return
        }

        setIsLoading(false)
        setHasSubmitted(true)

        if (confirmationType === 'redirect' && redirect) {
          const { url } = redirect

          const redirectUrl = url

          if (redirectUrl) router.push(redirectUrl)
        }
      } catch (err) {
        console.warn(err)
        setIsLoading(false)
        setError({
          message: 'Something went wrong.'
        })
      }
    }

    void submitForm()
  }

  return (
    <div className="bg-fk-white mx-auto my-8 w-full max-w-3xl rounded-lg p-6 shadow-md">
      {enableIntro && introContent && !hasSubmitted && (
        <div className="mb-6 max-w-none">
          <RichText data={introContent} locale={locale} />
        </div>
      )}
      {confirmationMessage && !isLoading && hasSubmitted && confirmationType === 'message' && (
        <div className="bg-fk-green-light text-fk-black mb-6 rounded-md p-4">
          <RichText data={confirmationMessage} locale={locale} />
        </div>
      )}
      {isLoading && !hasSubmitted && (
        <div className="bg-fk-blue-light text-fk-black mb-6 flex items-center justify-center rounded-md p-4">
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
          <span>{'Loading, please wait...'}</span>
        </div>
      )}
      {error && (
        <div className="bg-fk-red-light text-fk-white mb-6 rounded-md p-4">
          <p className="font-medium">{`${error.status || '500'}: ${error.message || ''}`}</p>
        </div>
      )}
      {!hasSubmitted && (
        <form id={formID.toString()} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {form.fields &&
              form.fields.map((field, index) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Field: React.FC<any> = fields?.[field.blockType]
                if (Field) {
                  return (
                    <Field
                      key={index}
                      form={form}
                      {...field}
                      {...formMethods}
                      control={control}
                      errors={errors}
                      register={register}
                    />
                  )
                }
                return null
              })}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-fk-blue text-fk-white hover:bg-fk-blue-dark focus:ring-fk-black rounded-md px-6 py-3 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
              disabled={isLoading}
            >
              {submitButtonLabel || 'Submit'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
