"use client"
import React from "react"

export default function Loader(){
  return (
    <div className="flex items-center gap-2">
      <div className="animate-spin h-5 w-5 border-2 border-blue-600 rounded-full border-t-transparent"></div>
      <span>Working...</span>
    </div>
  )
}
