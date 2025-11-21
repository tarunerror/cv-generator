import { NextResponse } from 'next/server'
import { generateLatex } from '../../../lib/aiGenerator'

export async function POST(req){
  const { jobDescription, resumeText } = await req.json()
  if (!jobDescription || !resumeText) return NextResponse.json({ error: 'Missing inputs' }, { status: 400 })
  try{
    const latex = await generateLatex({ jobDescription, resumeText, env: process.env })
    return NextResponse.json({ latex })
  }catch(err){
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
