import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  // Disable draft mode
  const draft = await draftMode()
  draft.disable()

  // Return a JSON response
  return NextResponse.json({ message: 'Draft mode disabled' })
}
