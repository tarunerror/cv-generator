import './globals.css'

export const metadata = {
  title: 'CV Generator',
  description: 'Generate tailored resumes from job descriptions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
