"use client"
import React from "react"
import { useDropzone } from "react-dropzone"

export default function UploadBox({ onFileSelected }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles[0]) onFileSelected(acceptedFiles[0])
    }
  })

  return (
    <div {...getRootProps()} className="border-dashed border-2 border-gray-300 p-6 text-center rounded cursor-pointer">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <p>Drag & drop your resume here, or click to select a file (PDF/DOCX)</p>
      )}
    </div>
  )
}
