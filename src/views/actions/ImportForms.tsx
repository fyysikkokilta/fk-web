'use client'

import { useState } from 'react'

import { parseOfficialCSV, parseFuksiCSV, importOfficials, importFuksiYear } from './utils'

export const ImportForms = () => {
  const [resultMessage, setResultMessage] = useState<string>('')

  const handleSubmitImportOfficials = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const formData = new FormData(e.currentTarget)

    const officialsFile = formData.get('officials')
    if (!(officialsFile instanceof File)) {
      alert('Invalid file')
      return
    }

    const csvText = await officialsFile.text()
    const parseResult = parseOfficialCSV(csvText)

    if (!parseResult.success) {
      setResultMessage(`Official import failed: ${parseResult.error}`)
      return
    }

    const result = await importOfficials(parseResult.data)
    if (result.ok) {
      setResultMessage('Official import successful!')
    } else {
      setResultMessage(`Official import failed. ${await result.text()}`)
    }
  }

  const handleSubmitImportFuksis = async (e: React.SubmitEvent<HTMLFormElement>) => {
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

    const csvText = await groupsFile.text()
    const parseResult = parseFuksiCSV(csvText)

    if (!parseResult.success) {
      setResultMessage(`Fuksi import failed: ${parseResult.error}`)
      return
    }

    const result = await importFuksiYear(year, parseResult.data)
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
        onSubmit={(e) => void handleSubmitImportOfficials(e)}
      >
        <h2>{'Import Officials'}</h2>
        <label htmlFor="officials" className="sr-only">
          {'Choose a toimarit.csv file'}
        </label>
        <input id="officials" name="officials" type="file" accept=".csv" />
        <button type="submit">{'Upload Officials'}</button>
      </form>

      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 10
        }}
        onSubmit={(e) => void handleSubmitImportFuksis(e)}
      >
        <h2>{'Import Fuksis'}</h2>
        <label htmlFor="year" className="sr-only">
          {'Choose a year'}
        </label>
        <input id="year" name="year" type="number" />
        <label htmlFor="groups" className="sr-only">
          {'Choose a fuksit.csv file'}
        </label>
        <input id="groups" name="groups" type="file" accept=".csv" />
        <button type="submit">{'Upload Fuksis'}</button>
      </form>
    </>
  )
}
