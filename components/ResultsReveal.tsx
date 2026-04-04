'use client'
import { useEffect, useState } from 'react'
import { GenderMode, MatchResults, ScoredName } from '@/lib/types'

interface Props {
  results: MatchResults
  nameA?: string
  nameB?: string
  genderMode?: GenderMode
}

function ScoreBar({ score, animate }: { score: number; animate: boolean }) {
  const pct = Math.round((score / 20) * 100)
  const color =
    pct > 75 ? 'from-pink-400 to-blue-400' :
    pct > 40 ? 'from-yellow-300 to-orange-400' :
    'from-gray-200 to-gray-300'
  return (
    <div className="w-full bg-gray-100 dark:bg-[#241c38] rounded-full h-2.5 mt-2 overflow-hidden">
      <div
        className={`bg-gradient-to-r ${color} h-2.5 rounded-full`}
        style={{ width: animate ? `${pct}%` : '0%', transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}
      />
    </div>
  )
}

function NameResult({ result, rank, nameA, nameB, index, animate }: {
  result: ScoredName; rank: number; nameA: string; nameB: string; index: number; animate: boolean
}) {
  const isTopThree = rank <= 3
  const bothPicked = result.rank_a !== null && result.rank_b !== null
  const medals = ['🥇', '🥈', '🥉']

  return (
    <div
      className={`rounded-2xl p-4 border-2 transition-all ${
        isTopThree
          ? 'border-pink-200 dark:border-purple-800 bg-gradient-to-r from-pink-50 to-blue-50 dark:from-[#1f1030] dark:to-[#0f1a30] shadow-md'
          : 'border-gray-100 dark:border-[#352a50] bg-white dark:bg-[#1a1428]'
      }`}
      style={{
        opacity: animate ? 1 : 0,
        transform: animate ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.4s ease ${index * 0.07}s, transform 0.4s ease ${index * 0.07}s`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{isTopThree ? medals[rank - 1] : `#${rank}`}</span>
          <span className={`font-bold ${isTopThree ? 'text-2xl text-gray-800 dark:text-white' : 'text-lg text-gray-700 dark:text-[#e2d5f0]'}`}>
            {result.name}
          </span>
          {bothPicked && <span className="text-pink-400 text-sm">❤️</span>}
        </div>
        <span className={`font-bold ${isTopThree ? 'text-2xl text-pink-500 dark:text-purple-400' : 'text-lg text-gray-500 dark:text-[#7c6d9a]'}`}>
          {result.score}pts
        </span>
      </div>
      <ScoreBar score={result.score} animate={animate} />
      {result.meaning && (
        <p className="text-xs text-gray-400 dark:text-[#7c6d9a] mt-2">{result.meaning} · {result.origin}</p>
      )}
      <div className="flex gap-4 mt-1.5 text-xs text-gray-400 dark:text-[#7c6d9a]">
        <span>{nameA}: {result.rank_a ? `#${result.rank_a}` : '—'}</span>
        <span>{nameB}: {result.rank_b ? `#${result.rank_b}` : '—'}</span>
        {bothPicked && <span className="text-pink-400 dark:text-purple-400 font-medium">Both picked this!</span>}
      </div>
    </div>
  )
}

function ButterflyChart({ names, nameA, nameB, animate }: {
  names: ScoredName[]; nameA: string; nameB: string; animate: boolean
}) {
  return (
    <div className="bg-white dark:bg-[#1a1428] rounded-2xl border-2 border-gray-100 dark:border-[#352a50] p-5">
      <div className="flex items-center mb-4">
        <div className="flex-1 text-right pr-3 text-sm font-semibold text-pink-500 dark:text-[#f0abcb]">♀ {nameA}</div>
        <div className="w-28 shrink-0" />
        <div className="flex-1 text-left pl-3 text-sm font-semibold text-blue-500 dark:text-purple-400">♂ {nameB}</div>
      </div>
      <div className="flex flex-col gap-4">
        {names.slice(0, 10).map((n, i) => {
          const scoreA = n.rank_a ? 11 - n.rank_a : 0
          const scoreB = n.rank_b ? 11 - n.rank_b : 0
          const pctA = (scoreA / 10) * 100
          const pctB = (scoreB / 10) * 100
          const bothPicked = n.rank_a !== null && n.rank_b !== null
          return (
            <div key={n.name} style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(12px)', transition: `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s` }}>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex justify-end overflow-hidden rounded-l-full">
                  <div className="h-8 rounded-l-full bg-gradient-to-l from-pink-400 to-pink-200 dark:from-[#c026d3] dark:to-[#9333ea]"
                    style={{ width: animate ? `${pctA}%` : '0%', minWidth: scoreA > 0 && animate ? '6px' : '0', transition: `width 0.7s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.06}s` }} />
                </div>
                <div className="w-28 shrink-0 text-center">
                  <div className="text-sm font-bold text-gray-700 dark:text-[#e2d5f0] leading-tight">
                    {n.name}{bothPicked && <span className="ml-1 text-xs text-pink-400">❤️</span>}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-[#7c6d9a]">{n.score}pts</div>
                </div>
                <div className="flex-1 flex justify-start overflow-hidden rounded-r-full">
                  <div className="h-8 rounded-r-full bg-gradient-to-r from-blue-200 to-blue-400 dark:from-[#9333ea] dark:to-[#7c3aed]"
                    style={{ width: animate ? `${pctB}%` : '0%', minWidth: scoreB > 0 && animate ? '6px' : '0', transition: `width 0.7s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.06}s` }} />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 text-right pr-1 text-xs text-gray-300 dark:text-[#4a3870]">{n.rank_a ? `#${n.rank_a}` : '—'}</div>
                <div className="w-28 shrink-0" />
                <div className="flex-1 text-left pl-1 text-xs text-gray-300 dark:text-[#4a3870]">{n.rank_b ? `#${n.rank_b}` : '—'}</div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-[#352a50] text-center text-xs text-gray-400 dark:text-[#7c6d9a]">
        Bar width = points scored · Longer bar = ranked higher
      </div>
    </div>
  )
}

function NameSection({ title, names, view, nameA, nameB, animate }: {
  title: string; names: ScoredName[]; view: 'list' | 'chart'; nameA: string; nameB: string; animate: boolean
}) {
  const bothPicked = names.filter(n => n.rank_a !== null && n.rank_b !== null)
  const onlyOne = names.filter(n => n.rank_a === null || n.rank_b === null)
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{title}</h2>
      {view === 'chart' ? (
        <ButterflyChart names={names} nameA={nameA} nameB={nameB} animate={animate} />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {bothPicked.map((n, i) => <NameResult key={n.name} result={n} rank={i + 1} nameA={nameA} nameB={nameB} index={i} animate={animate} />)}
          </div>
          {onlyOne.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 dark:text-[#7c6d9a] font-medium mb-2">Only one of you picked these:</p>
              <div className="flex flex-col gap-2">
                {onlyOne.map((n, i) => <NameResult key={n.name} result={n} rank={bothPicked.length + i + 1} nameA={nameA} nameB={nameB} index={bothPicked.length + i} animate={animate} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function ResultsReveal({ results, nameA = 'Parent A', nameB = 'Parent B', genderMode = 'both' }: Props) {
  const [revealed, setRevealed] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [view, setView] = useState<'list' | 'chart'>('list')

  useEffect(() => {
    if (revealed) {
      const t = setTimeout(() => setAnimate(true), 80)
      return () => clearTimeout(t)
    }
  }, [revealed])

  if (!revealed) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-6">
        <div className="text-7xl animate-bounce">👶</div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Your Matches Are Ready!</h1>
        <p className="text-gray-400 dark:text-[#7c6d9a] text-lg">{nameA} &amp; {nameB} — are you both together?</p>
        <p className="text-gray-300 dark:text-[#4a3870] text-base">Time to find out what you both love...</p>
        <button
          onClick={() => setRevealed(true)}
          className="bg-gradient-to-r from-pink-400 to-blue-400 dark:from-[#c026d3] dark:to-[#9333ea] text-white text-xl font-bold px-12 py-5 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          ❤️ Reveal Our Matches
        </button>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto p-6 pb-16">
      <div className="text-center mb-8 pt-8 md:pt-2"
        style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(-12px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
        <div className="text-5xl mb-3">🎉</div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{nameA} &amp; {nameB}&apos;s Matches</h1>
        <p className="text-gray-400 dark:text-[#7c6d9a] mt-2">Higher score = you both love it more</p>
        <div className="inline-flex mt-5 bg-gray-100 dark:bg-[#241c38] rounded-2xl p-1 gap-1">
          <button onClick={() => setView('list')} className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${view === 'list' ? 'bg-white dark:bg-[#1a1428] shadow text-gray-800 dark:text-white' : 'text-gray-400 dark:text-[#7c6d9a] hover:text-gray-600 dark:hover:text-[#c084fc]'}`}>
            📋 List
          </button>
          <button onClick={() => setView('chart')} className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${view === 'chart' ? 'bg-white dark:bg-[#1a1428] shadow text-gray-800 dark:text-white' : 'text-gray-400 dark:text-[#7c6d9a] hover:text-gray-600 dark:hover:text-[#c084fc]'}`}>
            📊 Chart
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        {(genderMode === 'both' || genderMode === 'girls') && (
          <NameSection title="👧 Girl Names" names={results.girls} view={view} nameA={nameA} nameB={nameB} animate={animate} />
        )}
        {(genderMode === 'both' || genderMode === 'boys') && (
          <NameSection title="👦 Boy Names" names={results.boys} view={view} nameA={nameA} nameB={nameB} animate={animate} />
        )}
      </div>
    </main>
  )
}
