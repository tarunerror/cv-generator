export function wrapLaTeX(body){
  // A minimal LaTeX wrapper which the AI can also override if needed
  return `\\documentclass[11pt]{article}
\\usepackage[margin=0.6in]{geometry}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{parskip}
\\pagestyle{empty}
\\begin{document}
${body}
\\end{document}`
}
