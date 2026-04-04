'use client'
import { useEffect, useState } from 'react'
import { Session } from '@/lib/types'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? ''

export default function RejoinPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [copiedA, setCopiedA] = useState(false)
  const [copiedB, setCopiedB] = useState(false)

  useEffect(() => { params.then(p => setSessionId(p.sessionId)) }, [params])

  useEffect(() => {
    if (!sessionId) return
    async function load() {
      const res = await fetch(`/api/sessions/${sessionId}`)
      if (!res.ok) { setNotFound(true); return }
      setSession((await res.json()).session)
    }
    load()
    const interval = setInterval(async () => {
      const res = await fetch(`/api/sessions/${sessionId}`)
      if (res.ok) setSession((await res.json()).session)
    }, 5000)
    return () => clearInterval(interval)
  }, [sessionId])

  if (notFound) return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white dark:bg-[#1a1428] dark:border dark:border-[#352a50] rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🤔</div>
        <h1 className="text-xl font-bold text-gray-700 dark:text-white mb-2">Session not found</h1>
        <p className="text-gray-400 dark:text-[#7c6d9a] text-sm">Double-check the link — the session code may be wrong.</p>
        <a href="/new" className="mt-6 inline-block text-pink-500 dark:text-purple-400 hover:text-pink-600 text-sm font-medium">← Create a new session</a>
      </div>
    </main>
  )

  if (!session) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-3xl animate-pulse">👶</div>
    </main>
  )

  const shortCode = session.id.split('-')[0].toUpperCase()
  const bothDone = session.submitted_a && session.submitted_b

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white dark:bg-[#1a1428] dark:border dark:border-[#352a50] rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-3">👶</div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{session.label}</h1>
        <div className="inline-block bg-gray-100 dark:bg-[#241c38] text-gray-500 dark:text-[#c084fc] text-xs font-mono px-3 py-1 rounded-full mb-6">
          {shortCode}
        </div>

        <div className="flex gap-3 mb-6">
          {[
            { name: session.name_a, done: session.submitted_a },
            { name: session.name_b, done: session.submitted_b },
          ].map(p => (
            <div key={p.name} className={`flex-1 rounded-2xl p-3 text-sm font-medium border-2 ${
              p.done
                ? 'bg-green-50 dark:bg-[#0f2a1a] text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                : 'bg-gray-50 dark:bg-[#241c38] text-gray-400 dark:text-[#7c6d9a] border-gray-100 dark:border-[#352a50]'
            }`}>
              {p.done ? '✅' : '⏳'} {p.name}
            </div>
          ))}
        </div>

        {bothDone ? (
          <a href={`/results/${session.id}`}
            className="block w-full bg-gradient-to-r from-pink-400 to-blue-400 dark:from-[#c026d3] dark:to-[#9333ea] text-white text-lg font-bold py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all mb-4">
            ❤️ See Our Matches →
          </a>
        ) : (
          <p className="text-sm text-gray-400 dark:text-[#7c6d9a] mb-4">
            Waiting for {[!session.submitted_a && session.name_a, !session.submitted_b && session.name_b].filter(Boolean).join(' and ')} to finish...
          </p>
        )}

        <div className="flex flex-col gap-3">
          {[
            { href: `/pick/${session.token_a}`, name: session.name_a, done: session.submitted_a, gradient: 'from-pink-400 to-pink-500', icon: '👩', copied: copiedA, onCopy: () => { navigator.clipboard.writeText(`${BASE_URL}/pick/${session.token_a}`); setCopiedA(true); setTimeout(() => setCopiedA(false), 2000) } },
            { href: `/pick/${session.token_b}`, name: session.name_b, done: session.submitted_b, gradient: 'from-blue-400 to-blue-500 dark:from-[#c026d3] dark:to-[#9333ea]', icon: '👨', copied: copiedB, onCopy: () => { navigator.clipboard.writeText(`${BASE_URL}/pick/${session.token_b}`); setCopiedB(true); setTimeout(() => setCopiedB(false), 2000) } },
          ].map(p => (
            <div key={p.name} className="flex gap-2">
              <a href={p.href} className={`flex-1 bg-gradient-to-r ${p.done ? 'from-green-400 to-emerald-500' : p.gradient} text-white text-sm font-semibold py-3 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all text-center`}>
                {p.done ? `✅ ${p.name} — edit list` : `${p.icon} ${p.name} — Start Picking!`}
              </a>
              <button onClick={p.onCopy} className="px-3 py-3 border-2 border-gray-200 dark:border-[#352a50] rounded-2xl text-gray-400 dark:text-[#7c6d9a] hover:border-gray-300 dark:hover:border-purple-600 hover:text-gray-500 dark:hover:text-purple-400 transition-all text-sm">
                {p.copied ? '✅' : '📋'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
