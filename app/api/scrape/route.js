import { NextResponse } from 'next/server'
import { scrapeWithSerpApi, scrapeFallback } from '../../../lib/scrape'

export async function POST(req){
  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: 'No url provided' }, { status: 400 })
  const serpKey = process.env.SERPAPI_KEY || process.env.NEXT_PUBLIC_SERPAPI_KEY
  let jdText = await scrapeWithSerpApi(url, serpKey)
  if (!jdText) jdText = await scrapeFallback(url)
  return NextResponse.json({ jdText })
}
