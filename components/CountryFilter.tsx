'use client'
import { useEffect, useMemo, useRef, useState } from 'react'

export interface Country {
  code: string
  label: string
  flag: string
  locales: string[]
  priority: number
}

interface Props {
  countries: Country[]
  value: string
  onChange: (code: string) => void
}

function detectLocaleCode(countries: Country[]): string {
  if (typeof navigator === 'undefined') return ''
  const lang = navigator.language || ''
  const langShort = lang.split('-')[0]
  // Exact match first (en-GB), then prefix match (en)
  const exact = countries.find(c => c.locales.includes(lang))
  if (exact) return exact.code
  const prefix = countries.find(c => c.locales.some(l => l.startsWith(langShort)))
  return prefix?.code ?? ''
}

export function CountryFilter({ countries, value, onChange }: Props) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [detectedCode, setDetectedCode] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setDetectedCode(detectLocaleCode(countries))
  }, [countries])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return countries.filter(c =>
      !q || c.label.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    )
  }, [countries, search])

  // Split into priority groups
  const detected   = filtered.filter(c => c.code === detectedCode && c.code !== '')
  const priority1  = filtered.filter(c => c.priority === 1 && c.code !== detectedCode)
  const priority2  = filtered.filter(c => c.priority === 2 && c.code !== detectedCode)
  const priority3  = filtered.filter(c => c.priority === 3 && c.code !== detectedCode)

  const selectedCountry = countries.find(c => c.code === value)

  function select(code: string) {
    onChange(code)
    setOpen(false)
    setSearch('')
  }

  function CountryBtn({ c, subtle = false }: { c: Country; subtle?: boolean }) {
    const active = value === c.code
    return (
      <button
        onClick={() => select(c.code)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all text-left w-full ${
          active
            ? 'bg-gradient-to-r from-pink-400 to-blue-400 dark:from-[#c026d3] dark:to-[#9333ea] text-white shadow-sm'
            : subtle
            ? 'text-gray-400 dark:text-[#7c6d9a] hover:bg-gray-50 dark:hover:bg-[#241c38]'
            : 'text-gray-600 dark:text-[#c084fc] hover:bg-gray-100 dark:hover:bg-[#241c38]'
        }`}
      >
        <span>{c.flag}</span>
        <span>{c.label}</span>
      </button>
    )
  }

  return (
    <div className="relative" ref={ref}>
      {/* Trigger bar */}
      <div className="flex items-center gap-2">
        {/* All button */}
        <button
          onClick={() => select('')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            value === ''
              ? 'bg-gradient-to-r from-pink-400 to-blue-400 dark:from-[#c026d3] dark:to-[#9333ea] text-white shadow-sm'
              : 'bg-gray-100 dark:bg-[#241c38] text-gray-500 dark:text-[#c084fc] hover:bg-gray-200 dark:hover:bg-[#352a50]'
          }`}
        >
          All
        </button>

        {/* Quick picks: detected locale + priority 1 */}
        {[...detected, ...priority1].slice(0, 5).map(c => (
          <button
            key={c.code}
            onClick={() => select(c.code)}
            title={c.label}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
              value === c.code
                ? 'bg-gradient-to-r from-pink-400 to-blue-400 dark:from-[#c026d3] dark:to-[#9333ea] text-white shadow-sm'
                : 'bg-gray-100 dark:bg-[#241c38] text-gray-500 dark:text-[#c084fc] hover:bg-gray-200 dark:hover:bg-[#352a50]'
            }`}
          >
            <span>{c.flag}</span>
            <span className="hidden sm:inline">{c.label}</span>
          </button>
        ))}

        {/* More button */}
        <button
          onClick={() => setOpen(o => !o)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
            open || (value !== '' && !detected.concat(priority1).slice(0,5).find(c => c.code === value))
              ? 'bg-gradient-to-r from-pink-400 to-blue-400 dark:from-[#c026d3] dark:to-[#9333ea] text-white shadow-sm'
              : 'bg-gray-100 dark:bg-[#241c38] text-gray-500 dark:text-[#c084fc] hover:bg-gray-200 dark:hover:bg-[#352a50]'
          }`}
        >
          {selectedCountry && !detected.concat(priority1).slice(0,5).find(c => c.code === value)
            ? <><span>{selectedCountry.flag}</span><span className="hidden sm:inline">{selectedCountry.label}</span></>
            : <span>More {open ? '▲' : '▼'}</span>
          }
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#1a1428] border-2 border-gray-100 dark:border-[#352a50] rounded-2xl shadow-xl z-50 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-100 dark:border-[#352a50]">
            <input
              autoFocus
              className="w-full text-sm bg-gray-50 dark:bg-[#241c38] dark:text-[#e2d5f0] dark:placeholder-[#7c6d9a] border border-gray-200 dark:border-[#352a50] rounded-xl px-3 py-2 focus:outline-none focus:border-pink-300 dark:focus:border-purple-500"
              placeholder="🔍 Search languages..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {/* All */}
            <button
              onClick={() => select('')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium w-full text-left transition-all ${
                value === ''
                  ? 'bg-gradient-to-r from-pink-400 to-blue-400 dark:from-[#c026d3] dark:to-[#9333ea] text-white'
                  : 'text-gray-600 dark:text-[#c084fc] hover:bg-gray-100 dark:hover:bg-[#241c38]'
              }`}
            >
              🌍 All languages
            </button>

            {detected.length > 0 && !search && (
              <>
                <p className="text-xs text-gray-400 dark:text-[#7c6d9a] px-3 pt-3 pb-1 font-semibold uppercase tracking-wide">Your language</p>
                {detected.map(c => <CountryBtn key={c.code} c={c} />)}
              </>
            )}

            {priority1.length > 0 && (
              <>
                <p className="text-xs text-gray-400 dark:text-[#7c6d9a] px-3 pt-3 pb-1 font-semibold uppercase tracking-wide">Popular</p>
                {priority1.map(c => <CountryBtn key={c.code} c={c} />)}
              </>
            )}

            {priority2.length > 0 && (
              <>
                <p className="text-xs text-gray-400 dark:text-[#7c6d9a] px-3 pt-3 pb-1 font-semibold uppercase tracking-wide">Common</p>
                {priority2.map(c => <CountryBtn key={c.code} c={c} />)}
              </>
            )}

            {priority3.length > 0 && (
              <>
                <p className="text-xs text-gray-400 dark:text-[#7c6d9a] px-3 pt-3 pb-1 font-semibold uppercase tracking-wide">All languages</p>
                {priority3.map(c => <CountryBtn key={c.code} c={c} />)}
              </>
            )}

            {filtered.length === 0 && (
              <p className="text-center text-gray-400 dark:text-[#7c6d9a] py-6 text-sm">No match for &quot;{search}&quot;</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
