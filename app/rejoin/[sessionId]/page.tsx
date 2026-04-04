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

  useEffect(() => {
    params.then(p => setSessionId(p.sessionId))
  }, [params])

  useEffect(() => {
    if (!sessionId) return
    async function load() {
      const res = await fetch(`/api/sessions/${sessionId}`)
      if (!res.ok) { setNotFound(true); return }
      const json = await res.json()
      setSession(json.session)
    }
    load()
    const interval = setInterval(async () => {
      const res = await fetch(`/api/sessions/${sessionId}`)
      if (res.ok) {
        const json = await res.json()
        setSession(json.session)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [sessionId])

  if (notFound) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🤔</div>
          <h1 className="text-xl font-bold text-gray-700 mb-2">Session not found</h1>
          <p className="text-gray-400 text-sm">Double-check the link — the session code may be wrong.</p>
          <a href="/new" className="mt-6 inline-block text-pink-500 hover:text-pink-600 text-sm font-medium">
            ← Create a new session
          </a>
        </div>
      </main>
    )
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-3xl animate-pulse">👶</div>
      </main>
    )
  }

  const shortCode = session.id.split('-')[0].toUpperCase()
  const bothDone = session.submitted_a && session.submitted_b

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-3">👶</div>
        <h1 className="text-xl font-bold text-gray-800 mb-1">{session.label}</h1>
        <div className="inline-block bg-gray-100 text-gray-500 text-xs font-mono px-3 py-1 rounded-full mb-6">
          {shortCode}
        </div>

        {/* Status summary */}
        <div className="flex gap-3 mb-6">
          <div className={`flex-1 rounded-2xl p-3 text-sm font-medium ${
            session.submitted_a ? 'bg-green-50 text-green-700 border-2 border-green-200' : 'bg-gray-50 text-gray-400 border-2 border-gray-100'
          }`}>
            {session.submitted_a ? '✅' : '⏳'} {session.name_a}
          </div>
          <div className={`flex-1 rounded-2xl p-3 text-sm font-medium ${
            session.submitted_b ? 'bg-green-50 text-green-700 border-2 border-green-200' : 'bg-gray-50 text-gray-400 border-2 border-gray-100'
          }`}>
            {session.submitted_b ? '✅' : '⏳'} {session.name_b}
          </div>
        </div>

        {bothDone ? (
          <a
            href={`/results/${session.id}`}
            className="block w-full bg-gradient-to-r from-pink-400 to-blue-400 text-white text-lg font-bold py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all mb-4"
          >
            ❤️ See Our Matches →
          </a>
        ) : (
          <p className="text-sm text-gray-400 mb-4">
            Waiting for {[!session.submitted_a && session.name_a, !session.submitted_b && session.name_b].filter(Boolean).join(' and ')} to finish...
          </p>
        )}

        <div className="flex flex-col gap-3">
          <RejoinButton
            href={`/pick/${session.token_a}`}
            name={session.name_a}
            submitted={session.submitted_a}
            gradient="from-pink-400 to-pink-500"
            icon="👩"
            onCopy={() => {
              navigator.clipboard.writeText(`${BASE_URL}/pick/${session.token_a}`)
              setCopiedA(true)
              setTimeout(() => setCopiedA(false), 2000)
            }}
            copied={copiedA}
          />
          <RejoinButton
            href={`/pick/${session.token_b}`}
            name={session.name_b}
            submitted={session.submitted_b}
            gradient="from-blue-400 to-blue-500"
            icon="👨"
            onCopy={() => {
              navigator.clipboard.writeText(`${BASE_URL}/pick/${session.token_b}`)
              setCopiedB(true)
              setTimeout(() => setCopiedB(false), 2000)
            }}
            copied={copiedB}
          />
        </div>
      </div>
    </main>
  )
}

function RejoinButton({
  href,
  name,
  submitted,
  gradient,
  icon,
  onCopy,
  copied,
}: {
  href: string
  name: string
  submitted: boolean
  gradient: string
  icon: string
  onCopy: () => void
  copied: boolean
}) {
  return (
    <div className="flex gap-2">
      <a
        href={href}
        className={`flex-1 bg-gradient-to-r ${
          submitted ? 'from-green-400 to-emerald-500' : gradient
        } text-white text-sm font-semibold py-3 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all text-center`}
      >
        {submitted ? `✅ ${name} — edit list` : `${icon} ${name} — Start Picking!`}
      </a>
      <button
        onClick={onCopy}
        className="px-3 py-3 border-2 border-gray-200 rounded-2xl text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-all text-sm"
        title={`Copy ${name}'s link`}
      >
        {copied ? '✅' : '📋'}
      </button>
    </div>
  )
}
