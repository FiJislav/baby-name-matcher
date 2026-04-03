'use client'
import { useState } from 'react'
import { MatchResults, ScoredName } from '@/lib/types'

interface Props {
  results: MatchResults
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round((score / 20) * 100)
  const color = pct > 75 ? 'from-pink-400 to-pink-500' : pct > 40 ? 'from-yellow-300 to-orange-400' : 'from-gray-200 to-gray-300'
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2">
      <div className={`bg-gradient-to-r ${color} h-2.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function NameResult({ result, rank }: { result: ScoredName; rank: number }) {
  const isTopThree = rank <= 3
  const bothPicked = result.rank_a !== null && result.rank_b !== null
  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className={`rounded-2xl p-4 border-2 transition-all ${
      isTopThree
        ? 'border-pink-200 bg-gradient-to-r from-pink-50 to-blue-50 shadow-md'
        : 'border-gray-100 bg-white'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{isTopThree ? medals[rank - 1] : `#${rank}`}</span>
          <span className={`font-bold ${isTopThree ? 'text-2xl text-gray-800' : 'text-lg text-gray-700'}`}>
            {result.name}
          </span>
          {bothPicked && <span className="text-pink-400 text-sm">❤️</span>}
        </div>
        <span className={`font-bold ${isTopThree ? 'text-2xl text-pink-500' : 'text-lg text-gray-500'}`}>
          {result.score}pts
        </span>
      </div>
      <ScoreBar score={result.score} />
      {result.meaning && (
        <p className="text-xs text-gray-400 mt-2">{result.meaning} · {result.origin}</p>
      )}
      <div className="flex gap-4 mt-1.5 text-xs text-gray-400">
        <span>Parent A: {result.rank_a ? `#${result.rank_a}` : '—'}</span>
        <span>Parent B: {result.rank_b ? `#${result.rank_b}` : '—'}</span>
        {bothPicked && <span className="text-pink-400 font-medium">Both picked this!</span>}
      </div>
    </div>
  )
}

function NameSection({ title, names }: { title: string; names: ScoredName[] }) {
  const bothPicked = names.filter(n => n.rank_a !== null && n.rank_b !== null)
  const onlyOne = names.filter(n => n.rank_a === null || n.rank_b === null)
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="flex flex-col gap-3">
        {bothPicked.map((n, i) => <NameResult key={n.name} result={n} rank={i + 1} />)}
      </div>
      {onlyOne.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-400 font-medium mb-2">Only one of you picked these:</p>
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
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-6">
        <div className="text-7xl animate-bounce">👶</div>
        <h1 className="text-4xl font-bold text-gray-800">Your Matches Are Ready!</h1>
        <p className="text-gray-400 text-lg">Are you both together? Time to find out...</p>
        <button
          onClick={() => setRevealed(true)}
          className="bg-gradient-to-r from-pink-400 to-blue-400 text-white text-xl font-bold px-12 py-5 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
        >
          ❤️ Reveal Our Matches
        </button>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🎉</div>
        <h1 className="text-4xl font-bold text-gray-800">Your Baby Name Matches</h1>
        <p className="text-gray-400 mt-2">Higher score = you both love it more</p>
      </div>
      <div className="flex flex-col gap-10">
        <NameSection title="👧 Girl Names" names={results.girls} />
        <NameSection title="👦 Boy Names" names={results.boys} />
      </div>
    </main>
  )
}
