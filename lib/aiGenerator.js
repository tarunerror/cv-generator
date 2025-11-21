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
          { role: "system", content: "You are a LaTeX expert. Output ONLY raw LaTeX code. No markdown blocks." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 3000
      }
      const resp = await axios.post(url, body, {
        headers: { Authorization: `Bearer ${env.OPENROUTER_API_KEY}`, "Content-Type": "application/json" }
      })
      let text = resp.data?.choices?.[0]?.message?.content || resp.data?.choices?.[0]?.text || ''
      text = cleanLatexOutput(text)
      return text
    } catch (err) {
      console.warn('OpenRouter failed, trying Ollama:', err.message)
    }
  }

  // Option B: Ollama (local)
  try{
    const url = `http://localhost:11434/api/generate`
    const body = { model: env.OLLAMA_MODEL || 'qwen2.5', prompt, max_tokens: 3000, stream: false }
    const resp = await axios.post(url, body, { timeout: 60000 })
    let text = resp.data?.response || resp.data?.text || ''
    text = cleanLatexOutput(text)
    return text
  }catch(err){
    console.warn('Ollama call failed', err.message)
  }

  // Fallback: return sample LaTeX for testing
  console.warn('Using sample LaTeX as fallback')
  return `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}

\\begin{document}

\\begin{center}
    {\\LARGE \\textbf{John Doe}} \\\\[0.5em]
    john.doe@email.com | (123) 456-7890 | LinkedIn/JohnDoe
\\end{center}

\\section*{Summary}
Experienced software engineer with expertise in web development and AI integration.

\\section*{Skills}
\\begin{itemize}
  \\item JavaScript, React, Node.js
  \\item Python, Machine Learning
  \\item LaTeX, Technical Writing
\\end{itemize}

\\section*{Experience}
\\textbf{Software Engineer} - Tech Corp \\hfill 2020--Present
\\begin{itemize}
  \\item Developed web applications using React and Node.js
  \\item Integrated AI models for resume generation
\\end{itemize}

\\section*{Education}
Bachelor of Science in Computer Science - University \\hfill 2016--2020

\\end{document}`
}

function cleanLatexOutput(text) {
  if (!text) return ""
  // Remove markdown code blocks if present
  return text.replace(/```latex/g, "").replace(/```/g, "").trim()
}

function buildPrompt(jobDescription, resumeText){
  // Limit input lengths to avoid token limits
  const maxJobLen = 2000
  const maxResumeLen = 3000
  const jd = jobDescription.length > maxJobLen ? jobDescription.substring(0, maxJobLen) + '...' : jobDescription
  const res = resumeText.length > maxResumeLen ? resumeText.substring(0, maxResumeLen) + '...' : resumeText

  return `You are an expert resume writer.
Job Description:
${jd}

Candidate Resume Text:
${res}

Task:
Rewrite the resume into a standard, simple LaTeX format.
RULES:
1. Use ONLY standard LaTeX packages (geometry, hyperref). AVOID complicated packages like 'fontspec' or custom fonts.
2. Structure: Name/Header, Summary, Skills, Experience, Projects, Education.
3. Tailor the content to the Job Description (keywords, emphasis).
4. Output valid, compilable LaTeX code ONLY. Do not enclose in markdown code blocks.
5. Use \\documentclass{article}.
6. Keep it to 1 page if possible.

Begin LaTeX code:`
}
