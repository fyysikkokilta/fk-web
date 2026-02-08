import React from 'react'

const widthMap: Record<number, string> = {
  25: 'w-1/4',
  33: 'w-1/3',
  50: 'w-1/2',
  66: 'w-2/3',
  75: 'w-3/4',
  100: 'w-full'
}

export const Width: React.FC<{
  children: React.ReactNode
  width?: number
}> = ({ children, width }) => {
  return <div className={`${widthMap[width ?? 100]}`}>{children}</div>
}
