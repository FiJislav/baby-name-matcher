import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DarkModeToggle } from '@/components/DarkModeToggle'

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
        {/* BMAC floating widget — must be injected as raw script tag so data-* attrs are present when script executes */}
        <div dangerouslySetInnerHTML={{ __html: `
          <script
            data-name="BMC-Widget"
            data-cfasync="false"
            src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
            data-id="fiji"
            data-description="Support me on Buy me a coffee!"
            data-message=""
            data-color="#5F7FFF"
            data-position="Right"
            data-x_margin="18"
            data-y_margin="18">
          </script>
        `}} />
      </body>
    </html>
  )
}
