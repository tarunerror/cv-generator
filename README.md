# CV Generator - AI-Powered Resume Tailoring Application

A Next.js application that automatically generates tailored resumes by analyzing job descriptions and optimizing existing resumes using AI. The app scrapes job postings, parses resume files, and creates ATS-optimized LaTeX resumes with PDF preview and download capabilities.

## Features

- **Job Description Scraping**: Extract job requirements from any URL using SerpAPI with intelligent fallback scraping
- **Resume Parsing**: Support for PDF and DOCX resume uploads with text extraction
- **AI-Powered Generation**: Dual AI support (OpenRouter online + Ollama local) for resume optimization
- **LaTeX Output**: Professional LaTeX resume generation with clean formatting
- **PDF Generation**: Client-side PDF generation and preview using react-pdf
- **ATS Optimization**: Keywords matching and formatting optimized for Applicant Tracking Systems
- **Responsive UI**: Clean, modern interface built with Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** with hooks
- **Tailwind CSS** for styling
- **React Dropzone** for file uploads
- **React-PDF** for PDF preview and rendering

### Backend (Serverless Functions)
- **Next.js API Routes** for serverless functions
- **SerpAPI** for job description scraping
- **Cheerio** for HTML parsing (fallback scraping)
- **pdf-parse** for PDF text extraction
- **mammoth** for DOCX text extraction

### AI Integration
- **OpenRouter API** (online, free tier available)
- **Ollama** (local LLM support)
- **qwen2.5-7b-instruct** model (free on OpenRouter)

### PDF Generation
- **pdf-lib** for client-side PDF creation
- **LaTeX.js** for LaTeX rendering
- **KaTeX** for mathematical expressions

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cv-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your API keys:
   ```env
   # Optional: SerpAPI key for enhanced job scraping
   SERPAPI_KEY=your_serpapi_key_here
   
   # Optional: OpenRouter API key for online AI generation
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   
   # Optional: Ollama model name (if running locally)
   OLLAMA_MODEL=qwen2.5:7b
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Basic Workflow

1. **Enter Job URL**: Paste the URL of a job posting you want to apply for
2. **Upload Resume**: Drag and drop your PDF or DOCX resume file
3. **Generate**: Click "Generate Resume" to create a tailored version
4. **Download**: Get both LaTeX source and PDF versions

### AI Configuration Options

#### Option A: OpenRouter (Online, Free)
- Sign up at [OpenRouter](https://openrouter.ai/)
- Get your API key
- Add to `.env.local` as `OPENROUTER_API_KEY`
- Uses `qwen/qwen-2.5-7b-instruct:free` model

#### Option B: Ollama (Local, Offline)
- Install [Ollama](https://ollama.ai/)
- Pull the model: `ollama pull qwen2.5:7b`
- Start Ollama: `ollama serve`
- The app will automatically detect and use local Ollama

### SerpAPI Setup (Optional)
- Sign up at [SerpAPI](https://serpapi.com/)
- Get your API key
- Add to `.env.local` as `SERPAPI_KEY`
- Enables enhanced job description extraction

## API Endpoints

### `/api/scrape`
- **Method**: POST
- **Input**: `{ url: string }`
- **Output**: `{ jdText: string }`
- **Description**: Scrapes job description from provided URL

### `/api/parse`
- **Method**: POST
- **Input**: `{ fileName: string, fileType: string, fileBase64: string }`
- **Output**: `{ resumeText: string }`
- **Description**: Extracts text from uploaded PDF/DOCX files

### `/api/generate`
- **Method**: POST
- **Input**: `{ jobDescription: string, resumeText: string }`
- **Output**: `{ latex: string }`
- **Description**: Generates tailored LaTeX resume using AI

## File Structure

```
cv-generator/
├── app/
│   ├── api/
│   │   ├── scrape/route.js      # Job scraping endpoint
│   │   ├── parse/route.js       # Resume parsing endpoint
│   │   └── generate/route.js    # AI generation endpoint
│   ├── globals.css              # Global styles
│   ├── layout.js               # Root layout
│   └── page.js                 # Main application page
├── components/
│   ├── UploadBox.jsx           # File upload component
│   ├── PdfPreview.jsx          # PDF preview component
│   └── Loader.jsx              # Loading indicator
├── lib/
│   ├── scrape.js               # Web scraping utilities
│   ├── parseResume.js          # Resume parsing logic
│   ├── aiGenerator.js          # AI integration
│   ├── latexTemplate.js        # LaTeX templates
│   └── pdfGenerator.js         # PDF generation utilities
├── public/
│   └── default-template.tex    # Default LaTeX template
├── .env.example                # Environment variables template
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Troubleshooting

### Common Issues

1. **PDF Generation Fails**
   - LaTeX code is still available for download
   - Use external LaTeX compiler (pdflatex, XeLaTeX) for complex documents

2. **Job Scraping Doesn't Work**
   - Check if SerpAPI key is valid
   - Fallback scraping will attempt direct URL access
   - Some sites may block automated scraping

3. **AI Generation Fails**
   - Ensure either OpenRouter API key is valid or Ollama is running
   - Check network connectivity for OpenRouter
   - Verify Ollama model is downloaded: `ollama list`

4. **File Upload Issues**
   - Ensure files are PDF or DOCX format
   - Check file size (large files may timeout)
   - Verify file is not password-protected

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Recent Improvements

✅ **Fixed AI Model Integration**
- Updated to use `qwen/qwen-2.5-7b-instruct:free` on OpenRouter
- Improved Ollama API integration with proper response handling
- Enhanced prompt engineering for better resume generation

✅ **Enhanced Job Scraping**
- Improved SerpAPI integration with Google Jobs API
- Better fallback scraping with job-specific selectors
- Added proper error handling and user-agent headers

✅ **PDF Generation & Preview**
- Implemented client-side PDF generation using pdf-lib
- Added PDF preview component with react-pdf
- LaTeX to PDF conversion with proper text parsing

✅ **UI/UX Improvements**
- Added error handling and user feedback
- Disabled button states for better UX
- Responsive grid layout for preview section
- Enhanced styling with hover effects

✅ **Code Quality**
- Fixed all dependency issues
- Improved error handling throughout the application
- Added comprehensive documentation
- Proper environment variable management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
