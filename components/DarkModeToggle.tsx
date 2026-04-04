'use client'
import { useEffect, useState } from 'react'

export function DarkModeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="fixed top-4 right-4 z-50 flex items-center gap-1.5 bg-white/80 dark:bg-[#1a1428]/90 backdrop-blur border border-pink-100 dark:border-[#352a50] rounded-full px-3 py-1.5 shadow-md hover:shadow-lg transition-all"
    >
      <span style={{ opacity: dark ? 0.35 : 1, transition: 'opacity 0.3s', fontSize: 14 }}>☀️</span>
      <div className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${dark ? 'bg-purple-600' : 'bg-pink-200'}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${dark ? 'left-5' : 'left-0.5'}`} />
      </div>
      <span style={{ opacity: dark ? 1 : 0.35, transition: 'opacity 0.3s', fontSize: 14 }}>🌙</span>
    </button>
  )
}
