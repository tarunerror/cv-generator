# CV Generator (Next.js + Tailwind)

This project is a resume generator that:
- Scrapes a job description (uses SerpAPI with fallback scraping)
- Parses uploaded resumes (PDF/DOCX)
- Calls an AI (OpenRouter online or local Ollama) to generate an ATS-optimized LaTeX resume
- Compiles/Previews LaTeX on the client using `latex.js` and previews via `react-pdf` (subject to local tool compatibility)

Quick setup

1. Install dependencies:

```powershell
cd d:/cv-generator; npm install
```

2. Create `.env` from `.env.example` and set keys:

- `SERPAPI_KEY` — required for SerpAPI scraping
- `OPENROUTER_API_KEY` — optional; if present, the app will use OpenRouter online
- `OLLAMA_MODEL` — optional; used when Ollama is running locally

OpenRouter mode

- Add `OPENROUTER_API_KEY` to `.env`. The serverless `/api/generate` route will call OpenRouter at `https://openrouter.ai/api/v1/chat/completions`.

Ollama local mode

- Run Ollama locally (example): `ollama run` or follow Ollama docs. The app will call `http://localhost:11434/api/generate` if `OPENROUTER_API_KEY` is not set.

SerpAPI usage

- Provide `SERPAPI_KEY` in `.env`. The `/api/scrape` route attempts SerpAPI first, then falls back to direct scraping.

LaTeX → PDF rendering

- The app generates LaTeX code. To create PDFs, compile the downloaded `.tex` file with a LaTeX distribution like TeX Live or MiKTeX.
- Client-side PDF preview is not implemented due to compatibility issues; use the LaTeX file with external tools.

Run the app

```powershell
npm run dev
# then open http://localhost:3000 (or 3001 if port conflict)
```

Notes

- This scaffold uses base64 file upload for serverless API routes.
- You may want to secure the SerpAPI and OpenRouter keys in production.
- The AI prompt is in `lib/aiGenerator.js`. Tweak instructions for tone, length, or formatting.
- PDF preview requires server-side LaTeX compilation (not implemented here).
- If no AI backend is configured, the app returns a sample LaTeX for testing.
