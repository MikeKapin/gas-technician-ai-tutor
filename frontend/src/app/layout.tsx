import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gas Technician AI Tutor | Canadian Gas Code Assistant',
  description: 'Intelligent AI tutor for Canadian Gas Technician training. Learn CSA B149.1-25 code, gas appliance installation, safety procedures, and certification modules with personalized explanations and real-world examples.',
  keywords: [
    'Gas Technician',
    'CSA B149.1-25',
    'Canadian Gas Code',
    'AI Tutor',
    'Gas Training',
    'Appliance Installation',
    'Gas Safety',
    'HVAC Education',
    'Code Compliance',
    'G1 G2 G3 Certification'
  ],
  authors: [{ name: 'Gas Technician AI Tutor' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Gas Technician AI Tutor',
    description: 'Master Canadian Gas Code with AI-powered personalized tutoring',
    type: 'website',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gas Technician AI Tutor',
    description: 'AI-powered Canadian Gas Code training assistant',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1e3a8a" />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        <div id="root" className="h-full">
          {children}
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: 'text-sm',
            success: {
              className: 'toast-success',
              iconTheme: {
                primary: '#ffffff',
                secondary: '#22c55e',
              },
            },
            error: {
              className: 'toast-error',
              iconTheme: {
                primary: '#ffffff',
                secondary: '#ef4444',
              },
            },
            loading: {
              className: 'toast-info',
              iconTheme: {
                primary: '#ffffff',
                secondary: '#3b82f6',
              },
            },
          }}
        />
      </body>
    </html>
  )
}