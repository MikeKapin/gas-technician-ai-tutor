import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Canadian Gas Technician Tutor | G3 G2 Certification',
  description: 'AI-powered tutor for Canadian Gas Technician certification. CSA B149.1-25 & B149.2-25 compliant training for G3 and G2 gas technicians.',
  keywords: [
    'Canadian Gas Technician',
    'G3 Certification',
    'G2 Certification',
    'CSA B149.1-25',
    'CSA B149.2-25',
    'Gas Technician Training',
    'LARK Labs',
    'AI Tutor'
  ],
  authors: [{ name: 'LARK Labs' }],
  creator: 'LARK Labs',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Canadian Gas Technician Tutor | G3 G2 Certification',
    description: 'AI-powered tutor for Canadian Gas Technician certification. CSA B149.1-25 & B149.2-25 compliant training.',
    type: 'website',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Canadian Gas Technician Tutor | G3 G2 Certification',
    description: 'AI-powered tutor for Canadian Gas Technician certification. CSA B149.1-25 & B149.2-25 compliant training.',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans antialiased">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}