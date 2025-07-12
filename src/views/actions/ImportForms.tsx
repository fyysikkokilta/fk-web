'use client'

import { FormEvent, useState } from 'react'

export const ImportForms = () => {
  const [resultMessage, setResultMessage] = useState<string>('')

  const importOfficials = async (
    divisions: {
      name: string
      nameEn: string
      officialRoles: { name: string; nameEn: string; officials: string[] }[]
    }[]
  ) =>
    await fetch('/api/officials/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ divisions })
    })

  const importFuksiYear = async (
    year: number,
    groups: {
      name: string
      fuksis: string[]
    }[]
  ) =>
    await fetch('/api/fuksis/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ year, groups })
    })

  const parseOfficialCSV = (csvText: string) => {
    if (!csvText || csvText.trim().length === 0) {
      return { success: false as const, error: 'CSV file is empty' }
    }

    const lines = csvText.trim().split('\n')
    if (lines.length === 0) {
      return { success: false as const, error: 'No data found in CSV file' }
    }

    const divisionsMap = new Map<
      string,
      {
        name: string
        nameEn: string
        officialRoles: { name: string; nameEn: string; officials: string[] }[]
      }
    >()

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex]
      const lineNumber = lineIndex + 1

      if (!line || line.trim().length === 0) {
        continue // Skip empty lines
      }

      let columns = line.split(';').map((col) => col.trim())
      if (columns.length === 1) {
        columns = line.split(',').map((col) => col.trim())
      }

      // Validate minimum required columns
      if (columns.length < 5) {
        return {
          success: false as const,
          error: `Line ${lineNumber}: Insufficient columns. Expected at least 5 columns (division FI, division EN, role FI, role EN, official name), got ${columns.length}`
        }
      }

      // Validate required fields
      if (!columns[0]) {
        return {
          success: false as const,
          error: `Line ${lineNumber}: Division name (Finnish) is required`
        }
      }

      if (!columns[1]) {
        return {
          success: false as const,
          error: `Line ${lineNumber}: Division name (English) is required`
        }
      }

      if (!columns[2]) {
        return {
          success: false as const,
          error: `Line ${lineNumber}: Role name (Finnish) is required`
        }
      }

      if (!columns[3]) {
        return {
          success: false as const,
          error: `Line ${lineNumber}: Role name (English) is required`
        }
      }

      const divisionNameFi = columns[0]
      const divisionNameEn = columns[1]
      const roleNameFi = columns[2]
      const roleNameEn = columns[3]
      const officials = columns.slice(4).filter((official) => official)

      // Validate that at least one official is provided
      if (officials.length === 0) {
        return {
          success: false as const,
          error: `Line ${lineNumber}: At least one official name is required for role "${roleNameFi}"`
        }
      }

      // Use Finnish names as primary keys
      const divisionKey = divisionNameFi
      const roleKey = roleNameFi

      if (!divisionsMap.has(divisionKey)) {
        divisionsMap.set(divisionKey, {
          name: divisionNameFi,
          nameEn: divisionNameEn,
          officialRoles: []
        })
      }

      const division = divisionsMap.get(divisionKey)!
      const existingRole = division.officialRoles.find((role) => role.name === roleKey)

      if (existingRole) {
        // Add officials to existing role
        existingRole.officials.push(...officials)
      } else {
        // Create new role
        division.officialRoles.push({
          name: roleKey,
          nameEn: roleNameEn,
          officials
        })
      }
    }

    const result = Array.from(divisionsMap.values())
    if (result.length === 0) {
      return { success: false as const, error: 'No valid data found in CSV file' }
    }

    return { success: true as const, data: result }
  }

  const parseFuksiCSV = (csvText: string) => {
    if (!csvText || csvText.trim().length === 0) {
      return { success: false as const, error: 'CSV file is empty' }
    }

    const lines = csvText.trim().split('\n')
    if (lines.length === 0) {
      return { success: false as const, error: 'No data found in CSV file' }
    }

    const groups: { name: string; fuksis: string[] }[] = []

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex]
      const lineNumber = lineIndex + 1

      if (!line || line.trim().length === 0) {
        continue // Skip empty lines
      }

      let columns = line.split(';').map((col) => col.trim())
      if (columns.length === 1) {
        columns = line.split(',').map((col) => col.trim())
      }

      // Validate minimum required columns
      if (columns.length < 2) {
        return {
          success: false as const,
          error: `Line ${lineNumber}: Insufficient columns. Expected at least 2 columns (group name, fuksi name), got ${columns.length}`
        }
      }

      // Validate required fields
      if (!columns[0]) {
        return { success: false as const, error: `Line ${lineNumber}: Group name is required` }
      }

      const groupName = columns[0]
      const fuksis = columns.slice(1).filter((fuksi) => fuksi)

      // Validate that at least one fuksi is provided
      if (fuksis.length === 0) {
        return {
          success: false as const,
          error: `Line ${lineNumber}: At least one fuksi name is required for group "${groupName}"`
        }
      }

      groups.push({ name: groupName, fuksis })
    }

    if (groups.length === 0) {
      return { success: false as const, error: 'No valid data found in CSV file' }
    }

    return { success: true as const, data: groups }
  }

  const handleSubmitImportOfficials = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleSubmitImportFuksiYear = async (e: React.FormEvent<HTMLFormElement>) => {
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
        onSubmit={(e: FormEvent<HTMLFormElement>) => void handleSubmitImportOfficials(e)}
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
        onSubmit={(e: FormEvent<HTMLFormElement>) => void handleSubmitImportFuksiYear(e)}
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
