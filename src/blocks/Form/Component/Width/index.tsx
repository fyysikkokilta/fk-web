import React from 'react'

export const Width: React.FC<{
  children: React.ReactNode
  width?: number
}> = ({ children, width }) => {
  // Convert percentage to Tailwind width classes
  const getWidthClass = (width?: number) => {
    if (!width) return 'w-full'

    // Map common percentages to Tailwind classes
    const widthMap: Record<number, string> = {
      25: 'w-1/4',
      33: 'w-1/3',
      50: 'w-1/2',
      66: 'w-2/3',
      75: 'w-3/4',
      100: 'w-full'
    }

    return widthMap[width] || `w-[${width}%]`
  }

  return <div className={getWidthClass(width)}>{children}</div>
}
