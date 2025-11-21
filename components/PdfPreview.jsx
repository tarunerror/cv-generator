"use client"
import React from "react"
import { Document, Page, pdfjs } from "react-pdf"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

export default function PdfPreview({ pdfData }) {
  return (
    <div className="border rounded p-3">
      <Document file={{ data: pdfData }}>
        <Page pageNumber={1} />
      </Document>
    </div>
  )
}
