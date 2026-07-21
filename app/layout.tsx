import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Cloud Cost — Сравнение цен на облачные сервера',
    template: 'Cloud Cost — Сравнение цен на облачные сервера',
  },
  description: 'Сравнивайте цены на VPS/VDS от DigitalOcean, AWS, Hetzner и других провайдеров. Экономьте до 40% на облачных серверах.',
  keywords: [
    'cloud cost',
    'сравнение цен облачных серверов',
    'VPS сравнение',
    'DigitalOcean',
    'AWS',
    'Hetzner',
    'облачные сервера',
    'экономия на облаках',
    'cloud pricing',
  ],
  authors: [{ name: 'Cloud Cost' }],
  creator: 'Cloud Cost',
  publisher: 'Cloud Cost',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://cloud-cost.vercel.app',
    title: 'Cloud Cost — Сравнение цен на облачные сервера',
    description: 'Сравнивайте цены на VPS/VDS от DigitalOcean, AWS, Hetzner и других провайдеров. Экономьте до 40% на облачных серверах.',
    siteName: 'Cloud Cost',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cloud Cost — Сравнение цен на облачные сервера',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloud Cost — Сравнение цен на облачные сервера',
    description: 'Сравнивайте цены на VPS/VDS от DigitalOcean, AWS, Hetzner и других провайдеров. Экономьте до 40% на облачных серверах.',
    images: ['/og-image.png'],
    creator: '@cloudcost',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#2563eb',
      },
    ],
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}