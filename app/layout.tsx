import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DarkModeToggle } from '@/components/DarkModeToggle'
import { BmacWidget } from '@/components/BmacWidget'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export const metadata: Metadata = {
  title: 'Baby Name Matcher',
  description: 'Find the baby name you both love',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}` }} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <DarkModeToggle />
        {children}
        <BmacWidget />
      </body>
    </html>
  )
}
