export const importOfficials = async (
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

export const importFuksiYear = async (
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

export const parseOfficialCSV = (csvText: string) => {
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

    const division = divisionsMap.get(divisionKey)
    const existingRole = division?.officialRoles.find((role) => role.name === roleKey)

    if (existingRole) {
      // Add officials to existing role
      existingRole.officials.push(...officials)
    } else {
      // Create new role
      division?.officialRoles.push({
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

export const parseFuksiCSV = (csvText: string) => {
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
