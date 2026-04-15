import type { Metadata } from 'next'
import './globals.css'
import MenuBar from '@/components/MenuBar'
import CyberBackground from '@/components/CyberBackground'
import { MusicPlayerProvider } from '@/components/MusicPlayerProvider'
import PersistentMusicPlayer from '@/components/PersistentMusicPlayer'

const siteUrl = 'https://graysonhicks.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Grayson Hicks — Full-Stack Developer | React, TypeScript, AI',
    template: '%s | Grayson Hicks',
  },
  description: 'Modern web development by Grayson Hicks. React, TypeScript, Three.js, AI.',
  keywords: 'grayson hicks, web developer, react, front end, full stack, remote, javascript',
  authors: [{ name: 'Grayson Hicks', url: siteUrl }],
  creator: 'Grayson Hicks',
  openGraph: {
    title: 'Grayson Hicks — Full-Stack Developer | React, TypeScript, AI',
    description: 'Modern web development by Grayson Hicks. React, TypeScript, Three.js, and AI.',
    type: 'website',
    siteName: 'Grayson Hicks',
    locale: 'en_US',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@graysonhicks',
    creator: '@graysonhicks',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.png', type: 'image/png', sizes: '310x310' },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/site.webmanifest',
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
        <MusicPlayerProvider>
          <CyberBackground />
          <MenuBar />
          <main className="relative z-10 pt-[25px] min-h-screen">
            {children}
          </main>
          <PersistentMusicPlayer />
        </MusicPlayerProvider>
      </body>
    </html>
  )
}
