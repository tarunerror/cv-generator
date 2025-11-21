"use client"
import React, { useState, useEffect } from "react"
import axios from "axios"
import UploadBox from "../components/UploadBox"
import Loader from "../components/Loader"
import LatexPreview from "../components/LatexPreview"

export default function Page() {
  const [jobUrl, setJobUrl] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [jobText, setJobText] = useState("")
  const [latex, setLatex] = useState("")
  const [loading, setLoading] = useState(false)

  // Helper to read file as Base64 using FileReader (browser compatible)
  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result
        // result is "data:application/pdf;base64,....."
        // we need only the base64 part
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handleParse(file) {
    setLoading(true)
    try {
      const base64 = await readFileAsBase64(file)
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
            <button className="btn" onClick={() => window.print()}>Download PDF (Print)</button>
          </div>
        </div>

        <div className="mt-6 bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-2">Preview</h2>
          {loading && <Loader />}
          {!loading && latex && (
            <div className="space-y-4">
              <div className="border rounded p-4 bg-white min-h-[500px]">
                 <LatexPreview latexCode={latex} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Generated LaTeX Code</h3>
                <pre className="whitespace-pre-wrap text-xs bg-gray-100 p-3 rounded max-h-40 overflow-auto">{latex}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
