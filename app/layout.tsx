import type { Metadata } from 'next'
import './globals.css'
import MenuBar from '@/components/MenuBar'
import CyberBackground from '@/components/CyberBackground'

export const metadata: Metadata = {
  title: 'GRAYSON HICKS // Developer',
  description: 'Modern web development by Grayson Hicks. React, TypeScript, Three.js, AI.',
  keywords: 'grayson hicks, web developer, react, front end, full stack, remote, javascript',
  openGraph: {
    title: 'GRAYSON HICKS // Developer',
    description: 'Modern web development by Grayson Hicks',
    type: 'website',
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
