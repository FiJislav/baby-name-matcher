'use client'
import { useCallback, useEffect, useState } from 'react'
import { NameCard } from './NameCard'
import { RankedList } from './RankedList'
import { NameWithPopularity, RankedEntry } from '@/lib/types'

const COUNTRIES = [
  { code: '', label: 'All' },
  { code: 'CZ', label: '🇨🇿 Czech' },
  { code: 'DE', label: '🇩🇪 German' },
  { code: 'GB', label: '🇬🇧 British' },
  { code: 'US', label: '🇺🇸 American' },
]

interface Props {
  token: string
  sessionId: string
  partnerSubmitted: boolean
}

export function NamePickerShell({ token, sessionId, partnerSubmitted: initialPartnerSubmitted }: Props) {
  const [gender, setGender] = useState<'girl' | 'boy'>('girl')
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
  const bothSubmitted = girlSubmitted && boySubmitted

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
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Pick Your Favourite Names</h1>

      <div className="flex gap-2 mb-6">
        {(['girl', 'boy'] as const).map(g => (
          <button
            key={g}
            onClick={() => setGender(g)}
            className={`px-6 py-2 rounded-full font-medium capitalize ${gender === g ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {g === 'girl' ? '👧 Girls' : '👦 Boys'}
            {g === 'girl' && girlSubmitted && ' ✅'}
            {g === 'boy' && boySubmitted && ' ✅'}
          </button>
        ))}
      </div>

      {submitted ? (
        <div className="text-center py-12">
          <p className="text-2xl font-semibold text-green-600">
            {gender === 'girl' ? 'Girls' : 'Boys'} list submitted! ✅
          </p>
          {!bothSubmitted && (
            <p className="text-gray-500 mt-2">
              Switch to {gender === 'girl' ? 'boys' : 'girls'} to complete your picks.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex flex-col gap-3 mb-4">
              <input
                className="border rounded px-3 py-2"
                placeholder="Search names..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="flex gap-2 flex-wrap">
                {COUNTRIES.map(c => (
                  <button
                    key={c.code}
                    onClick={() => setCountry(c.code)}
                    className={`px-3 py-1 rounded-full text-sm ${country === c.code ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              {country && (
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sortByPop}
                    onChange={e => setSortByPop(e.target.checked)}
                  />
                  Sort by popularity in {COUNTRIES.find(c => c.code === country)?.label}
                </label>
              )}
            </div>
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {names.map(n => (
                <NameCard
                  key={n.id}
                  name={n}
                  onAdd={name => addName(name)}
                  disabled={addedNames.has(n.name) || list.length >= 10}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Your Top 10 {gender === 'girl' ? 'Girl' : 'Boy'} Names ({list.length}/10)</h2>
            <RankedList
              entries={list}
              onReorder={setList}
              onRemove={removeAt}
              onAddCustom={name => addName(name, true)}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={list.length !== 10 || submitting}
              className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : `Submit ${gender === 'girl' ? 'Girl' : 'Boy'} Names`}
            </button>
          </div>
        </div>
      )}

      {bothSubmitted && (
        <div className="mt-12 text-center p-8 bg-green-50 rounded-xl border border-green-200">
          {partnerSubmitted ? (
            <>
              <p className="text-2xl font-bold text-green-700">Both parents have submitted! 🎉</p>
              <a
                href={`/results/${sessionId}`}
                className="mt-4 inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700"
              >
                See Your Matches →
              </a>
            </>
          ) : (
            <p className="text-xl text-gray-600">
              You're done! ✅ Waiting for your partner to finish...
            </p>
          )}
        </div>
      )}
    </div>
  )
}
