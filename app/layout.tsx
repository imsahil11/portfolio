import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const dmSans = DM_Sans({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://sahilyadav.me'),
  title: 'Sahil Yadav — Full Stack & Android Developer',
  description: 'BTech CSE developer specializing in MERN Stack and Android development with Kotlin. Class of 2023.',
  keywords: ['Sahil Yadav', 'Sahil Yadav portfolio', 'Sahil Yadav developer', 'MERN Stack Developer', 'Android Developer', 'Kotlin', 'Software Engineer'],
  authors: [{ name: 'Sahil Yadav' }],
  creator: 'Sahil Yadav',
  openGraph: {
    title: 'Sahil Yadav — Developer Portfolio',
    description: 'MERN Stack · Android · Java DSA · Building things that matter.',
    type: 'website',
    url: 'https://sahilyadav.me',
    siteName: 'Sahil Yadav',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bebasNeue.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
