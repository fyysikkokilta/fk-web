// eslint-disable-next-line no-restricted-imports
import Link from 'next/link'
// eslint-disable-next-line no-restricted-imports
import { redirect } from 'next/navigation'
import { AdminViewServerProps } from 'payload'
import React from 'react'

import { ImportForms } from './ImportForms'

export const ActionsView = ({
  initPageResult: {
    req: { user }
  }
}: AdminViewServerProps) => {
  if (!user) {
    redirect('/admin/login?redirect=%2Fadmin%2Factions')
  }

  return (
    <div
      style={{
        margin: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: 30
      }}
    >
      <Link href="/admin">{'Back'}</Link>
      <span
        style={{
          color: 'red',
          fontSize: '2em',
          WebkitTextStroke: '1px white',
          border: '2px solid red',
          padding: '10px'
        }}
      >
        {"⚠️ DO NOT USE UNLESS YOU KNOW WHAT YOU'RE DOING! ⚠️"}
      </span>
      <h1>{'Actions'}</h1>
      <div style={{ color: 'gray' }}>
        {
          'Photos have to be uploaded manually to the media library first. The filename should contain the name of the person with first and last name separated by a space.'
        }
        <br />
        {'For example, "Matti Virtanen" should have the filename "Matti-Virtanen.jpg".'}
      </div>
      <ImportForms />
    </div>
  )
}

export default ActionsView
