import { NextResponse } from 'next/server'
import { parseResumeFromBase64 } from '../../../lib/parseResume'

export async function POST(req){
  const body = await req.json()
  const { fileName, fileType, fileBase64 } = body || {}
  if (!fileBase64) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  const resumeText = await parseResumeFromBase64({ fileName, fileType, fileBase64 })
  return NextResponse.json({ resumeText })
}
