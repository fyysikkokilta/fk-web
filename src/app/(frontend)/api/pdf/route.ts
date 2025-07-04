import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: response.status })
    }

    const pdfBuffer = await response.arrayBuffer()

    // Create a new response with the PDF content but without X-Frame-Options
    const newResponse = new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': response.headers.get('Content-Length') || ''
        // Intentionally not setting X-Frame-Options to allow embedding
      }
    })

    return newResponse
  } catch (error) {
    console.error('PDF proxy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
