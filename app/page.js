"use client"
import React, { useState } from "react"
import axios from "axios"
import UploadBox from "../components/UploadBox"
// import PdfPreview from "../components/PdfPreview"
import Loader from "../components/Loader"

export default function Page() {
  const [jobUrl, setJobUrl] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [jobText, setJobText] = useState("")
  const [latex, setLatex] = useState("")
  // const [pdfData, setPdfData] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleParse(file) {
    setLoading(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString("base64")
      const res = await axios.post("/api/parse", {
        fileName: file.name,
        fileType: file.type,
        fileBase64: base64
      })
      setResumeText(res.data.resumeText || "")
    } catch (err) {
      console.error(err)
      alert("Failed to parse resume: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleScrape() {
    if (!jobUrl) return alert("Please provide a job URL")
    setLoading(true)
    try {
      const res = await axios.post("/api/scrape", { url: jobUrl })
      setJobText(res.data.jdText || "")
    } catch (err) {
      console.error(err)
      alert("Failed to fetch job description: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate() {
    if (!jobText) return alert("No job description available")
    if (!resumeText) return alert("No resume parsed")
    setLoading(true)
    try {
      const res = await axios.post("/api/generate", {
        jobDescription: jobText,
        resumeText
      })
      const latexCode = res.data.latex || ""
      setLatex(latexCode)
      // Note: PDF compilation with latex.js may require additional setup
      // For now, we generate LaTeX and provide download options
    } catch (err) {
      console.error(err)
      alert("Failed to generate resume: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  function downloadFile(content, filename, mime) {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">CV Generator</h1>

        <div className="space-y-4 bg-white p-6 rounded shadow">
          <label className="block text-sm font-medium">Job URL</label>
          <div className="flex gap-2">
            <input
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
              placeholder="https://company.com/jobs/1234"
            />
            <button className="btn" onClick={handleScrape}>Fetch JD</button>
          </div>

          <label className="block text-sm font-medium">Upload Resume (PDF or DOCX)</label>
          <UploadBox onFileSelected={handleParse} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Parsed Resume Text</h3>
              <textarea value={resumeText} onChange={(e)=>setResumeText(e.target.value)} className="w-full h-40 border rounded p-2" />
            </div>
            <div>
              <h3 className="font-semibold">Job Description</h3>
              <textarea value={jobText} onChange={(e)=>setJobText(e.target.value)} className="w-full h-40 border rounded p-2" />
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn-primary" onClick={handleGenerate}>Generate Resume</button>
            <button className="btn" onClick={()=>{ if(latex) downloadFile(latex,'resume.tex','application/x-tex') }}>Download LaTeX</button>
            <button className="btn" onClick={()=>{ alert('PDF generation requires server-side LaTeX compilation. Use the LaTeX file with a TeX distribution.') }}>Download PDF</button>
          </div>
        </div>

        <div className="mt-6 bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-2">Preview</h2>
          {loading && <Loader />}
          {!loading && latex && (
            <div>
              <h3 className="font-semibold mb-2">Generated LaTeX</h3>
              <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-3 rounded max-h-96 overflow-auto">{latex}</pre>
              <p className="text-sm text-gray-600 mt-2">To generate PDF, compile this LaTeX with pdflatex or similar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
