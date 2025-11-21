"use client"
import React, { useEffect, useRef, useState } from "react"
// We can't import latex.js directly in SSR/next.js easily because it might rely on window
// But we can dynamic import or use it in useEffect
import { parse, HtmlGenerator } from "latex.js"

export default function LatexPreview({ latexCode }) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!latexCode || !containerRef.current) return

    try {
      setError(null)
      // Clean up previous content
      containerRef.current.innerHTML = ""

      const generator = new HtmlGenerator({ hyphenate: false })
      const { styles, scripts } = generator

      // Create a shadow root or just append to container
      // latex.js output needs its stylesheet
      // We can add the styles to the document head or a style tag in the container

      // Parse and generate
      const doc = parse(latexCode, { generator: generator })

      // Append styles if not present
      // Note: latex.js styles are needed for proper rendering
      // For simplicity, we will rely on the generator.stylesAndScripts() or similar if available,
      // or just append the output 'doc.domFragment()'

      containerRef.current.appendChild(doc.domFragment())

      // Add required CSS for latex.js (basic approximation or link to CDN if needed)
      // But HtmlGenerator usually produces classes that need the latex.js CSS.
      // We will try to inject the default CSS if possible or user should include it globally.
      // Ideally, we should import "latex.js/dist/css/katex.css" etc.

    } catch (err) {
      console.error("LaTeX render error:", err)
      setError(err.message)
    }
  }, [latexCode])

  return (
    <div className="latex-preview-container">
       {/* We need to load latex.js default CSS for it to look right.
           Since we can't easily import CSS from node_modules in this setup without configuration,
           we'll add a link to the CDN version or rely on minimal styles. */}
       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/latex.js/dist/css/latex.css" />

       {error && <div className="text-red-500 p-4 border border-red-300 bg-red-50">Error rendering LaTeX: {error}</div>}
       <div ref={containerRef} className="latex-content p-8 bg-white shadow-sm min-h-[800px] w-full" />
    </div>
  )
}
