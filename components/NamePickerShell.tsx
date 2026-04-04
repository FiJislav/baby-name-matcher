'use client'
import { useCallback, useEffect, useState } from 'react'
import { NameCard } from './NameCard'
import { RankedList } from './RankedList'
import { GenderMode, NameWithPopularity, RankedEntry } from '@/lib/types'

const COUNTRIES = [
  { code: '', label: 'All' },
  { code: 'CZ', label: '🇨🇿 Czech' },
  { code: 'DE', label: '🇩🇪 German' },
  { code: 'GB', label: '🇬🇧 British' },
  { code: 'NL', label: '🇳🇱 Dutch' },
  { code: 'US', label: '🇺🇸 American' },
]

interface Props {
  token: string
  sessionId: string
  partnerSubmitted: boolean
  genderMode?: GenderMode
}

export function NamePickerShell({ token, sessionId, partnerSubmitted: initialPartnerSubmitted, genderMode = 'both' }: Props) {
  const [gender, setGender] = useState<'girl' | 'boy'>(genderMode === 'boys' ? 'boy' : 'girl')
  const [country, setCountry] = useState('')
  const [sortByPop, setSortByPop] = useState(false)
  const [search, setSearch] = useState('')
  const [names, setNames] = useState<NameWithPopularity[]>([])
  const [girlList, setGirlList] = useState<RankedEntry[]>([])
  const [boyList, setBoyList] = useState<RankedEntry[]>([])
  const [girlSubmitted, setGirlSubmitted] = useState(false)
  const [boySubmitted, setBoySubmitted] = useState(false)
  const [partnerSubmitted, setPartnerSubmitted] = useState(initialPartnerSubmitted)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const list = gender === 'girl' ? girlList : boyList
  const setList = gender === 'girl' ? setGirlList : setBoyList
  const submitted = gender === 'girl' ? girlSubmitted : boySubmitted
  const allSubmitted =
    genderMode === 'girls' ? girlSubmitted :
    genderMode === 'boys'  ? boySubmitted  :
    girlSubmitted && boySubmitted

  // Tint page background based on active gender
  useEffect(() => {
    document.body.classList.toggle('gender-girls', gender === 'girl')
    document.body.classList.toggle('gender-boys', gender === 'boy')
    return () => {
      document.body.classList.remove('gender-girls', 'gender-boys')
    }
  }, [gender])

  const fetchNames = useCallback(async () => {
    const params = new URLSearchParams({ gender })
    if (country) params.set('country', country)
    if (search) params.set('search', search)
    if (sortByPop && country) params.set('sort', 'popularity')
    const res = await fetch(`/api/names?${params}`)
    const json = await res.json()
    setNames(json.names ?? [])
  }, [gender, country, search, sortByPop])

  useEffect(() => { fetchNames() }, [fetchNames])

  useEffect(() => {
    if (partnerSubmitted) return
    const interval = setInterval(async () => {
      const res = await fetch(`/api/results/${sessionId}`)
      if (res.status !== 425) {
        setPartnerSubmitted(true)
        clearInterval(interval)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [partnerSubmitted, sessionId])

  function addName(name: string, isCustom = false) {
    if (list.length >= 10 || list.find(e => e.name === name)) return
    const record = names.find(n => n.name === name)
    setList([...list, { name, meaning: record?.meaning ?? '', origin: record?.origin ?? '', isCustom }])
  }

  function removeAt(index: number) {
    setList(list.filter((_, i) => i !== index))
  }

  async function handleSubmit() {
    if (list.length !== 10) return
    setSubmitting(true)
    setError('')
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, gender, names: list.map(e => e.name) }),
    })
    const json = await res.json()
    setSubmitting(false)
    if (!res.ok) { setError(json.error); return }
    if (gender === 'girl') setGirlSubmitted(true)
    else setBoySubmitted(true)
  }

  const addedNames = new Set(list.map(e => e.name))

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6 pt-8 md:pt-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">👶 Pick Your Names</h1>
        <p className="text-gray-400 dark:text-[#7c6d9a] mt-1 text-sm">Rank your top 10 — then see what you both love</p>
      </div>

      {/* Gender tabs */}
      {genderMode === 'both' && (
        <div className="flex gap-3 mb-6 justify-center">
          {(['girl', 'boy'] as const).map(g => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`px-8 py-3 rounded-full font-semibold text-sm shadow-sm transition-all ${
                gender === g
                  ? g === 'girl'
                    ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-md scale-105'
                    : 'bg-gradient-to-r from-blue-400 to-blue-500 dark:from-[#c026d3] dark:to-[#9333ea] text-white shadow-md scale-105'
                  : 'bg-white dark:bg-[#1a1428] text-gray-500 dark:text-[#c084fc] hover:bg-gray-50 dark:hover:bg-[#241c38] border-2 border-gray-100 dark:border-[#352a50]'
              }`}
            >
              {g === 'girl' ? '👧 Girls' : '👦 Boys'}
              {g === 'girl' && girlSubmitted && ' ✅'}
              {g === 'boy' && boySubmitted && ' ✅'}
            </button>
          ))}
        </div>
      )}

      {submitted ? (
        <div className="text-center py-14 bg-white dark:bg-[#1a1428] rounded-3xl shadow-sm border-2 border-green-100 dark:border-[#1a3a28]">
          <div className="text-5xl mb-3">✅</div>
          <p className="text-2xl font-bold text-green-600">{gender === 'girl' ? 'Girls' : 'Boys'} list submitted!</p>
          {!allSubmitted && genderMode === 'both' && (
            <p className="text-gray-400 dark:text-[#7c6d9a] mt-2">Switch to {gender === 'girl' ? 'boys' : 'girls'} to finish</p>
          )}
          <button
            onClick={() => gender === 'girl' ? setGirlSubmitted(false) : setBoySubmitted(false)}
            className="mt-5 text-sm text-gray-400 dark:text-[#7c6d9a] underline hover:text-gray-600 dark:hover:text-[#c084fc] transition-colors"
          >
            ✏️ Edit my list
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left: Name browser */}
          <div className={`bg-white dark:bg-[#1a1428] rounded-3xl shadow-sm border-2 p-4 transition-colors duration-500 ${gender === 'girl' ? 'border-pink-100 dark:border-[#4a1a38]' : 'border-blue-100 dark:border-[#1a2a50]'}`}>
            <h2 className="font-bold text-gray-700 dark:text-[#e2d5f0] mb-3 text-sm uppercase tracking-wide">Browse Names</h2>
            <div className="flex flex-col gap-2 mb-3">
              <input
                className="w-full border-2 border-gray-100 dark:border-[#352a50] dark:bg-[#241c38] dark:text-[#e2d5f0] dark:placeholder-[#7c6d9a] rounded-2xl px-4 py-2.5 text-sm focus:border-pink-300 dark:focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="🔍 Search names..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="flex gap-1.5 flex-wrap">
                {COUNTRIES.map(c => (
                  <button
                    key={c.code}
                    onClick={() => setCountry(c.code)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      country === c.code
                        ? 'bg-gradient-to-r from-pink-400 to-blue-400 dark:from-[#c026d3] dark:to-[#9333ea] text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-[#241c38] text-gray-500 dark:text-[#c084fc] hover:bg-gray-200 dark:hover:bg-[#352a50]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              {country && (
                <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#7c6d9a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sortByPop}
                    onChange={e => setSortByPop(e.target.checked)}
                    className="accent-pink-400"
                  />
                  Sort by popularity in {COUNTRIES.find(c => c.code === country)?.label}
                </label>
              )}
            </div>
            <div className="flex flex-col gap-2 max-h-[55vh] overflow-y-auto pr-1">
              {names.map(n => (
                <NameCard
                  key={n.id}
                  name={n}
                  onAdd={name => addName(name)}
                  disabled={addedNames.has(n.name) || list.length >= 10}
                  gender={gender}
                />
              ))}
              {names.length === 0 && (
                <p className="text-center text-gray-400 dark:text-[#7c6d9a] py-8 text-sm">No names found</p>
              )}
            </div>
          </div>

          {/* Right: Ranked list */}
          <div className={`bg-white dark:bg-[#1a1428] rounded-3xl shadow-sm border-2 p-4 transition-colors duration-500 ${gender === 'girl' ? 'border-pink-100 dark:border-[#4a1a38]' : 'border-blue-100 dark:border-[#1a2a50]'}`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-700 dark:text-[#e2d5f0] text-sm uppercase tracking-wide">Your Top 10</h2>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                list.length === 10
                  ? 'bg-green-100 dark:bg-[#1a3a28] text-green-600'
                  : 'bg-gray-100 dark:bg-[#241c38] text-gray-500 dark:text-[#c084fc]'
              }`}>
                {list.length}/10
              </span>
            </div>
            <RankedList
              entries={list}
              onReorder={setList}
              onRemove={removeAt}
              onAddCustom={name => addName(name, true)}
            />
            {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={list.length !== 10 || submitting}
              className={`mt-4 w-full py-4 rounded-2xl font-bold text-white text-lg shadow-md transition-all ${
                gender === 'girl'
                  ? 'bg-gradient-to-r from-pink-400 to-pink-500 hover:shadow-lg hover:scale-[1.02]'
                  : 'bg-gradient-to-r from-blue-400 to-blue-500 dark:from-[#c026d3] dark:to-[#9333ea] hover:shadow-lg hover:scale-[1.02]'
              } disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed`}
            >
              {submitting ? '✨ Submitting...' : `Submit ${gender === 'girl' ? '👧 Girl' : '👦 Boy'} Names`}
            </button>
          </div>
        </div>
      )}

      {allSubmitted && (
        <div className="mt-8 text-center p-8 bg-white dark:bg-[#1a1428] rounded-3xl shadow-sm border-2 border-green-100 dark:border-[#1a3a28]">
          {partnerSubmitted ? (
            <>
              <div className="text-5xl mb-3">🎉</div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">Both done! Time to reveal!</p>
              <a
                href={`/results/${sessionId}`}
                className="mt-4 inline-block bg-gradient-to-r from-pink-400 to-blue-400 dark:from-[#c026d3] dark:to-[#9333ea] text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                ❤️ See Our Matches →
              </a>
            </>
          ) : (
            <>
              <div className="text-4xl mb-3">⏳</div>
              <p className="text-xl font-semibold text-gray-600 dark:text-[#e2d5f0]">You&apos;re done!</p>
              <p className="text-gray-400 dark:text-[#7c6d9a] mt-1">Waiting for your partner to finish...</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
