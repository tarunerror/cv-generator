import pdfParse from "pdf-parse"
import mammoth from "mammoth"

export async function parseResumeFromBase64({ fileName, fileType, fileBase64 }){
  const buffer = Buffer.from(fileBase64, 'base64')
  const ext = (fileName || '').split('.').pop().toLowerCase()
  try{
    if (ext === 'pdf' || fileType === 'application/pdf'){
      const data = await pdfParse(buffer)
      return data.text || ''
    }
    // treat as docx
    if (ext === 'docx' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
      const res = await mammoth.extractRawText({ buffer })
      return res.value || ''
    }
    // fallback: try mammoth for other binary
    try{
      const res = await mammoth.extractRawText({ buffer })
      return res.value || ''
    }catch(e){
      return buffer.toString('utf8')
    }
  }catch(err){
    console.error('Failed parsing resume', err)
    return ''
  }
}
