'use client'
import { useState } from 'react'
import { MatchResults, ScoredName } from '@/lib/types'

interface Props {
  results: MatchResults
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round((score / 20) * 100)
  const color = pct > 75 ? 'bg-green-500' : pct > 40 ? 'bg-yellow-400' : 'bg-gray-300'
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
      <div className={`${color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function NameResult({ result, rank }: { result: ScoredName; rank: number }) {
  const isTopThree = rank <= 3
  const bothPicked = result.rank_a !== null && result.rank_b !== null
  return (
    <div className={`rounded-xl p-4 border ${isTopThree ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-gray-400 text-sm mr-2">#{rank}</span>
          <span className={`font-bold ${isTopThree ? 'text-2xl' : 'text-lg'}`}>{result.name}</span>
          {isTopThree && <span className="ml-2">{'⭐'.repeat(4 - rank)}</span>}
        </div>
        <div className="text-right">
          <span className="font-semibold text-lg">{result.score} pts</span>
        </div>
      </div>
      <ScoreBar score={result.score} />
      {result.meaning && (
        <p className="text-sm text-gray-500 mt-2">{result.meaning} · {result.origin}</p>
      )}
      <div className="flex gap-4 mt-2 text-sm text-gray-500">
        <span>Parent A: {result.rank_a ? `#${result.rank_a}` : '—'}</span>
        <span>Parent B: {result.rank_b ? `#${result.rank_b}` : '—'}</span>
        {bothPicked && <span className="text-green-600 font-medium">❤️ Both picked this!</span>}
      </div>
    </div>
  )
}

function NameSection({ title, names }: { title: string; names: ScoredName[] }) {
  const bothPicked = names.filter(n => n.rank_a !== null && n.rank_b !== null)
  const onlyOne = names.filter(n => n.rank_a === null || n.rank_b === null)
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex flex-col gap-3">
        {bothPicked.map((n, i) => <NameResult key={n.name} result={n} rank={i + 1} />)}
      </div>
      {onlyOne.length > 0 && (
        <div className="mt-6">
          <h3 className="text-gray-500 font-medium mb-2">Only one parent picked these:</h3>
          <div className="flex flex-col gap-2">
            {onlyOne.map((n, i) => <NameResult key={n.name} result={n} rank={bothPicked.length + i + 1} />)}
          </div>
        </div>
      )}
    </div>
  )
}

export function ResultsReveal({ results }: Props) {
  const [revealed, setRevealed] = useState(false)

  if (!revealed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
        <h1 className="text-4xl font-bold">Your Matches Are Ready! 🎉</h1>
        <p className="text-gray-500 text-lg">Are you both ready to see your favourite names?</p>
        <button
          onClick={() => setRevealed(true)}
          className="bg-pink-500 text-white text-xl px-10 py-4 rounded-2xl shadow-lg hover:bg-pink-600 transition-all hover:scale-105"
        >
          Reveal Our Matches ❤️
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-2">Your Baby Name Matches</h1>
      <p className="text-center text-gray-500 mb-10">Higher score = you both love it more</p>
      <div className="flex flex-col gap-12">
        <NameSection title="👧 Girl Names" names={results.girls} />
        <NameSection title="👦 Boy Names" names={results.boys} />
      </div>
    </div>
  )
}
