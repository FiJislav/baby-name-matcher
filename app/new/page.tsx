'use client'
import { useState } from 'react'
import { Session } from '@/lib/types'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? ''

export default function NewSessionPage() {
  const [inviteCode, setInviteCode] = useState('')
  const [label, setLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [session, setSession] = useState<Session | null>(null)
  const [copiedB, setCopiedB] = useState(false)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/sessions/public', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteCode, label }),
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) { setError(json.error); return }
    setSession(json.session)
  }

  function copyB() {
    if (!session) return
    navigator.clipboard.writeText(`${BASE_URL}/pick/${session.token_b}`)
    setCopiedB(true)
    setTimeout(() => setCopiedB(false), 2000)
  }

  if (session) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Your session is ready!</h1>
          <p className="text-gray-500 mb-8">Each of you tap your button below to start picking names</p>

          <div className="flex flex-col gap-4">
            <a
              href={`/pick/${session.token_a}`}
              className="block w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white text-lg font-semibold py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              👩 I am Parent A — Start Picking!
            </a>

            <a
              href={`/pick/${session.token_b}`}
              className="block w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white text-lg font-semibold py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              👨 I am Parent B — Start Picking!
            </a>

            <button
              onClick={copyB}
              className="w-full border-2 border-blue-300 text-blue-500 font-medium py-3 rounded-2xl hover:bg-blue-50 transition-all"
            >
              {copiedB ? '✅ Copied!' : '📋 Copy Parent B link to share'}
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Tip: Copy Parent B link and send it to your partner before tapping your own button
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👶</div>
          <h1 className="text-3xl font-bold text-gray-800">Baby Name Matcher</h1>
          <p className="text-gray-500 mt-2">Find the name you both love</p>
        </div>

        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Invite code</label>
            <input
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:border-pink-300 focus:outline-none transition-colors"
              placeholder="Enter your invite code"
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Your family name <span className="text-gray-400">(optional)</span></label>
            <input
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:border-pink-300 focus:outline-none transition-colors"
              placeholder="e.g. Smith family"
              value={label}
              onChange={e => setLabel(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-xl">
              {error === 'Invalid invite code' ? '❌ Wrong invite code — check with whoever sent you this link' : error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-400 to-blue-400 text-white text-lg font-semibold py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 mt-2"
          >
            {loading ? '✨ Creating...' : '✨ Create Our Session'}
          </button>
        </form>
      </div>
    </main>
  )
}
