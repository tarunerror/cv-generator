import axios from "axios"

export async function generateLatex({ jobDescription, resumeText, env }){
  const prompt = buildPrompt(jobDescription, resumeText)

  // Option A: OpenRouter (try first if key present)
  if (env.OPENROUTER_API_KEY && env.OPENROUTER_API_KEY !== 'your_openrouter_api_key_here') {
    try {
      const url = "https://openrouter.ai/api/v1/chat/completions"
      const body = {
        model: "x-ai/grok-4.1-fast:free",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 3000
      }
      const resp = await axios.post(url, body, {
        headers: { Authorization: `Bearer ${env.OPENROUTER_API_KEY}`, "Content-Type": "application/json" }
      })
      const text = resp.data?.choices?.[0]?.message?.content || resp.data?.choices?.[0]?.text || ''
      return text
    } catch (err) {
      console.warn('OpenRouter failed, trying Ollama:', err.message)
    }
  }

  // Option B: Ollama (local)
  try{
    const url = `http://localhost:11434/api/generate`
    const body = { model: env.OLLAMA_MODEL || 'qwen2.5', prompt, max_tokens: 3000 }
    const resp = await axios.post(url, body, { timeout: 60000 })
    const text = resp.data?.text || resp.data?.result || ''
    return text
  }catch(err){
    console.warn('Ollama call failed', err.message)
  }

  // Fallback: return sample LaTeX for testing
  console.warn('Using sample LaTeX as fallback')
  return `\\documentclass[11pt]{article}
\\usepackage[margin=0.6in]{geometry}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{parskip}
\\pagestyle{empty}
\\begin{document}
\\begin{center}
  {\\LARGE John Doe} \\\\
  john.doe@email.com $\\cdot$ (123) 456-7890 $\\cdot$ LinkedIn/JohnDoe
\\end{center}
\\vspace{4pt}
\\section*{Summary}
Experienced software engineer with expertise in web development and AI integration.
\\section*{Skills}
\\begin{itemize}[leftmargin=*]
  \\item JavaScript, React, Node.js
  \\item Python, Machine Learning
  \\item LaTeX, Technical Writing
\\end{itemize}
\\section*{Experience}
\\textbf{Software Engineer} --- Tech Corp \\hfill 2020--Present\\\\
\\begin{itemize}
  \\item Developed web applications using React and Node.js
  \\item Integrated AI models for resume generation
\\end{itemize}
\\section*{Education}
Bachelor of Science in Computer Science --- University \\hfill 2016--2020
\\end{document}`
}

function buildPrompt(jobDescription, resumeText){
  // Limit input lengths to avoid token limits
  const maxJobLen = 2000
  const maxResumeLen = 3000
  const jd = jobDescription.length > maxJobLen ? jobDescription.substring(0, maxJobLen) + '...' : jobDescription
  const res = resumeText.length > maxResumeLen ? resumeText.substring(0, maxResumeLen) + '...' : resumeText

  return `You are an expert resume writer who outputs a single, complete, compilable LaTeX resume document.\n\nJob Description:\n${jd}\n\nCandidate Resume Text:\n${res}\n\nRules:\n- Match skills, experience and summary to the job description.\n- Highlight keywords from the job posting.\n- Improve phrasing for impact.\n- Make resume ATS-friendly and one page.\n- Use a clean LaTeX design, avoid fancy colors.\n- Include sections: Name & contact, Summary, Skills, Experience, Projects, Education.\n- Output only the LaTeX document, no explanation.\n\nBegin.`
}
