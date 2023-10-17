import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mantri Mejeruk',
  description: 'Informasi Praktik Mantri',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <link rel="icon" href="/logo.png" sizes="any" />
      <body className={inter.className}>{children}</body>
    </html>
  )
}
