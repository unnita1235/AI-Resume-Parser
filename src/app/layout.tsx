import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'AI Resume Parser & Rewriter | Optimize Your Resume with AI',
  description: 'Transform your resume with AI-powered optimization. Get ATS-friendly formatting, professional tone adjustment, action verb enhancement, and personalized cover letters. Stand out to recruiters.',
  keywords: ['resume parser', 'AI resume', 'ATS optimization', 'resume rewriter', 'cover letter generator', 'job application', 'career tools'],
  authors: [{ name: 'Unni T A', url: 'https://github.com/unnita1235' }],
  creator: 'Unni T A',
  publisher: 'Unni T A',
  robots: 'index, follow',
  metadataBase: new URL('https://ai-resume-parser-seven.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-resume-parser-seven.vercel.app/',
    siteName: 'AI Resume Parser & Rewriter',
    title: 'AI Resume Parser & Rewriter | Optimize Your Resume with AI',
    description: 'Transform your resume with AI-powered optimization. Get ATS-friendly formatting, professional tone adjustment, and personalized cover letters.',
    images: [
      {
        url: '/screenshots/AI-Resume-Parser.png',
        width: 1200,
        height: 630,
        alt: 'AI Resume Parser & Rewriter Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Resume Parser & Rewriter | Optimize Your Resume with AI',
    description: 'Transform your resume with AI-powered optimization. Get ATS-friendly formatting and personalized cover letters.',
    images: ['/screenshots/AI-Resume-Parser.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "AI Resume Parser & Rewriter",
              "description": "AI-powered resume optimization tool with ATS scoring, tone adjustment, and cover letter generation",
              "url": "https://ai-resume-parser-seven.vercel.app/",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Person",
                "name": "Unni T A",
                "url": "https://github.com/unnita1235"
              },
              "featureList": [
                "AI-powered resume analysis",
                "ATS optimization scoring",
                "Tone adjustment (formal/casual)",
                "Action verb enhancement",
                "Cover letter generation",
                "PDF and DOCX file support"
              ]
            })
          }}
        />
      </head>
      <body className="font-body antialiased min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
