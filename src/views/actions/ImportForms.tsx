'use client'

import { FormEvent, useState } from 'react'

export const ImportForms = () => {
  const [resultMessage, setResultMessage] = useState<string>('')

  const importOfficials = async (
    year: number,
    divisions: { name: string; officialRoles: { name: string; officials: string[] }[] }[]
  ): Promise<Response> =>
    await fetch('/api/officials/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ year, divisions })
    })

  const importFuksiYear = async (
    year: number,
    groups: {
      name: string
      fuksis: string[]
    }[]
  ): Promise<Response> =>
    await fetch('/api/fuksis/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ year, groups })
    })

  const transformOfficials = (
    divisionsContent: Record<string, string[]>,
    officialsContent: Record<string, string[]>
  ) => {
    const divisions = Object.entries(divisionsContent).map(([name, officialRoles]) => ({
      name,
      officialRoles: officialRoles.map((officialRole) => ({
        name: officialRole,
        officials: Object.entries(officialsContent)
          .filter(([_name, officialRoles]) => officialRoles.includes(officialRole))
          .map(([name, _officialRoles]) => name)
      }))
    }))

    return { divisions }
  }

  const handleSubmitImportOfficials = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()
    e.stopPropagation()

    const formData = new FormData(e.currentTarget)

    const year: number = parseInt(formData.get('year') as string)
    if (Number.isNaN(year)) {
      alert('Invalid year')
      return
    }

    const divisionsFile = formData.get('divisions')
    if (!(divisionsFile instanceof File)) {
      alert('Invalid file')
      return
    }
    const divisionsContent = JSON.parse(await divisionsFile.text())

    const officialsFile = formData.get('officials')
    if (!(officialsFile instanceof File)) {
      alert('Invalid file')
      return
    }
    const officialsContent = JSON.parse(await officialsFile.text())

    // Backwards compatibility to old Wordpress format
    const { divisions } = transformOfficials(divisionsContent, officialsContent)

    const result = await importOfficials(year, divisions)
    if (result.ok) {
      setResultMessage('Official import successful!')
    } else {
      setResultMessage(`Official import failed. ${await result.text()}`)
    }
  }

  const handleSubmitImportFuksiYear = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()
    e.stopPropagation()

    const formData = new FormData(e.currentTarget)

    const year: number = parseInt(formData.get('year') as string)
    if (Number.isNaN(year)) {
      alert('Invalid year')
      return
    }

    const groupsFile = formData.get('groups')
    if (!(groupsFile instanceof File)) {
      alert('Invalid file')
      return
    }
    const groupsContent = JSON.parse(await groupsFile.text())

    const result = await importFuksiYear(year, groupsContent)
    if (result.ok) {
      setResultMessage('Fuksi import successful!')
    } else {
      setResultMessage(`Fuksi import failed. ${await result.text()}`)
    }
  }

  return (
    <>
      {resultMessage && <h2 style={{ color: 'success' }}>{resultMessage}</h2>}
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 10
        }}
        onSubmit={(e: FormEvent<HTMLFormElement>) => void handleSubmitImportOfficials(e)}
      >
        <h2>{'Import Officials'}</h2>
        <label htmlFor="year" className="sr-only">
          {'Choose a year'}
        </label>
        <input id="year" name="year" type="number" />
        <label htmlFor="divisions" className="sr-only">
          {'Choose a jaokset.json file'}
        </label>
        <input id="divisions" name="divisions" type="file" />
        <label htmlFor="officials" className="sr-only">
          {'Choose a toimarit.json file'}
        </label>
        <input id="officials" name="officials" type="file" />
        <button type="submit">{'Upload Officials'}</button>
      </form>

      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 10
        }}
        onSubmit={(e: FormEvent<HTMLFormElement>) => void handleSubmitImportFuksiYear(e)}
      >
        <h2>{'Import Fuksis'}</h2>
        <label htmlFor="year" className="sr-only">
          {'Choose a year'}
        </label>
        <input id="year" name="year" type="number" />
        <label htmlFor="groups" className="sr-only">
          {'Choose a fuksit.json file'}
        </label>
        <input id="groups" name="groups" type="file" />
        <button type="submit">{'Upload Fuksis'}</button>
      </form>
    </>
  )
}
