'use client'
import { useState } from 'react'
import { GenderMode, Session } from '@/lib/types'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? ''

const GENDER_OPTIONS: { value: GenderMode; label: string; icon: string; desc: string }[] = [
  { value: 'girls',  label: 'Girls only',  icon: '👧', desc: "We know it's a girl" },
  { value: 'both',   label: 'Both',        icon: '👶', desc: "We don't know yet" },
  { value: 'boys',   label: 'Boys only',   icon: '👦', desc: "We know it's a boy" },
]

export default function NewSessionPage() {
  const [inviteCode, setInviteCode] = useState('')
  const [label, setLabel] = useState('')
  const [nameA, setNameA] = useState('')
  const [nameB, setNameB] = useState('')
  const [genderMode, setGenderMode] = useState<GenderMode>('both')
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
      body: JSON.stringify({ inviteCode, label, nameA, nameB, genderMode }),
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

  const labelA = session?.name_a || nameA.trim() || 'Parent A'
  const labelB = session?.name_b || nameB.trim() || 'Parent B'

  if (session) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Your session is ready!</h1>
          <p className="text-gray-500 mb-8">Each of you tap your button to start picking names</p>

          <div className="flex flex-col gap-4">
            <a
              href={`/pick/${session.token_a}`}
              className="block w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white text-lg font-semibold py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              👩 I am {labelA} — Start Picking!
            </a>

            <a
              href={`/pick/${session.token_b}`}
              className="block w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white text-lg font-semibold py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              👨 I am {labelB} — Start Picking!
            </a>

            <button
              onClick={copyB}
              className="w-full border-2 border-blue-300 text-blue-500 font-medium py-3 rounded-2xl hover:bg-blue-50 transition-all"
            >
              {copiedB ? '✅ Copied!' : `📋 Copy ${labelB}'s link to share`}
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Tip: Copy {labelB}&apos;s link and send it to your partner before tapping your own button
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

        <form onSubmit={handleCreate} className="flex flex-col gap-5">
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

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                <span className="text-pink-400">♀</span> Your name
              </label>
              <input
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:border-pink-300 focus:outline-none transition-colors"
                placeholder="e.g. Anna"
                value={nameA}
                onChange={e => setNameA(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                <span className="text-blue-400">♂</span> Partner&apos;s name
              </label>
              <input
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:border-blue-300 focus:outline-none transition-colors"
                placeholder="e.g. Martin"
                value={nameB}
                onChange={e => setNameB(e.target.value)}
              />
            </div>
          </div>

          {/* Gender mode */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Do you know the gender?</label>
            <div className="grid grid-cols-3 gap-2">
              {GENDER_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setGenderMode(opt.value)}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 text-center transition-all ${
                    genderMode === opt.value
                      ? opt.value === 'girls'
                        ? 'border-pink-400 bg-pink-50 text-pink-700'
                        : opt.value === 'boys'
                        ? 'border-blue-400 bg-blue-50 text-blue-700'
                        : 'border-purple-400 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-xs font-semibold leading-tight">{opt.label}</span>
                  <span className="text-xs text-gray-400 leading-tight hidden sm:block">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Family name <span className="text-gray-400">(optional)</span></label>
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
            className="w-full bg-gradient-to-r from-pink-400 to-blue-400 text-white text-lg font-semibold py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 mt-1"
          >
            {loading ? '✨ Creating...' : '✨ Create Our Session'}
          </button>
        </form>
      </div>
    </main>
  )
}
