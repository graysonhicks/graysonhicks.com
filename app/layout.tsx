import type { Metadata } from 'next'
import './globals.css'
import MenuBar from '@/components/MenuBar'
import CyberBackground from '@/components/CyberBackground'

const siteUrl = 'https://graysonhicks.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GRAYSON HICKS // Developer',
    template: '%s // GRAYSON HICKS',
  },
  description: 'Modern web development by Grayson Hicks. React, TypeScript, Three.js, AI.',
  keywords: 'grayson hicks, web developer, react, front end, full stack, remote, javascript',
  authors: [{ name: 'Grayson Hicks', url: siteUrl }],
  creator: 'Grayson Hicks',
  openGraph: {
    title: 'GRAYSON HICKS // Developer',
    description: 'Modern web development by Grayson Hicks',
    type: 'website',
    siteName: 'Grayson Hicks',
    locale: 'en_US',
    url: siteUrl,
    images: [
      {
        url: '/images/headshot.png',
        width: 800,
        height: 800,
        alt: 'Grayson Hicks',
      },
    ],
  },
  twitter: {
    card: 'summary',
    creator: '@gaborhicks',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="scanlines crt-vignette min-h-screen">
        <CyberBackground />
        <MenuBar />
        <main className="relative z-10 pt-[25px] min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
