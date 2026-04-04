'use client'
import { useEffect, useState } from 'react'
import { GenderMode, Session } from '@/lib/types'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? ''

const GENDER_OPTIONS: { value: GenderMode; label: string; icon: string; desc: string }[] = [
  { value: 'girls',  label: 'Girls only',  icon: '👧', desc: "We know it's a girl" },
  { value: 'both',   label: 'Both',        icon: '👶', desc: "We don't know yet" },
  { value: 'boys',   label: 'Boys only',   icon: '👦', desc: "We know it's a boy" },
]

function SessionLinks({ session: initial }: { session: Session }) {
  const [session, setSession] = useState(initial)
  const [copiedB, setCopiedB] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  // Poll every 5s for submission status updates
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/sessions/${initial.id}`)
      if (res.ok) {
        const json = await res.json()
        setSession(s => ({ ...s, ...json.session }))
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [initial.id])

  function copyB() {
    navigator.clipboard.writeText(`${BASE_URL}/pick/${session.token_b}`)
    setCopiedB(true)
    setTimeout(() => setCopiedB(false), 2000)
  }

  function copyCode() {
    navigator.clipboard.writeText(`${BASE_URL}/rejoin/${session.id}`)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const shortCode = session.id.split('-')[0].toUpperCase()

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Your session is ready!</h1>
        <p className="text-gray-500 mb-6">Each of you tap your button to start picking names</p>

        <div className="flex flex-col gap-3">
          <ParentButton
            href={`/pick/${session.token_a}`}
            name={session.name_a}
            submitted={session.submitted_a}
            colorClass="from-pink-400 to-pink-500"
            submittedClass="from-green-400 to-emerald-500"
            icon="👩"
          />

          <ParentButton
            href={`/pick/${session.token_b}`}
            name={session.name_b}
            submitted={session.submitted_b}
            colorClass="from-blue-400 to-blue-500"
            submittedClass="from-green-400 to-emerald-500"
            icon="👨"
          />

          <button
            onClick={copyB}
            className="w-full border-2 border-blue-300 text-blue-500 font-medium py-3 rounded-2xl hover:bg-blue-50 transition-all"
          >
            {copiedB ? '✅ Copied!' : `📋 Copy ${session.name_b}'s link to share`}
          </button>
        </div>

        {/* Session code */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2">Session code — save this to come back later</p>
          <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-3">
            <span className="font-mono text-sm font-bold text-gray-700 flex-1 text-left tracking-widest">
              {shortCode}
            </span>
            <button
              onClick={copyCode}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {copiedCode ? '✅ Copied' : '📋 Copy link'}
            </button>
          </div>
          <a
            href={`/rejoin/${session.id}`}
            className="block text-xs text-pink-400 hover:text-pink-500 mt-2 transition-colors"
          >
            /rejoin/{shortCode}... →
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Tip: Copy {session.name_b}&apos;s link and send it before tapping your own button
        </p>
      </div>
    </main>
  )
}

function ParentButton({
  href,
  name,
  submitted,
  colorClass,
  submittedClass,
  icon,
}: {
  href: string
  name: string
  submitted: boolean
  colorClass: string
  submittedClass: string
  icon: string
}) {
  return (
    <a
      href={href}
      className={`block w-full bg-gradient-to-r ${
        submitted ? submittedClass : colorClass
      } text-white text-base font-semibold py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all`}
    >
      {submitted ? (
        <span>✅ {name} submitted — tap to edit</span>
      ) : (
        <span>{icon} I am {name} — Start Picking!</span>
      )}
    </a>
  )
}

// ── Setup form ────────────────────────────────────────────────────────────────

export default function NewSessionPage() {
  const [inviteCode, setInviteCode] = useState('')
  const [label, setLabel] = useState('')
  const [nameA, setNameA] = useState('')
  const [nameB, setNameB] = useState('')
  const [genderMode, setGenderMode] = useState<GenderMode>('both')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [session, setSession] = useState<Session | null>(null)

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

  if (session) return <SessionLinks session={session} />

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
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Family name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:border-pink-300 focus:outline-none transition-colors"
              placeholder="e.g. Smith family"
              value={label}
              onChange={e => setLabel(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-xl">
              {error === 'Invalid invite code'
                ? '❌ Wrong invite code — check with whoever sent you this link'
                : error}
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

        {/* Rejoin divider */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center mb-3">Already have a session?</p>
          <RejoinInput />
        </div>
      </div>
    </main>
  )
}

function RejoinInput() {
  const [code, setCode] = useState('')

  function handleRejoin(e: React.FormEvent) {
    e.preventDefault()
    // Accept full URL, full UUID, or just the short 8-char code prefix
    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
    const match = code.match(uuidPattern)
    if (match) {
      window.location.href = `/rejoin/${match[0]}`
    }
  }

  // Enable button only when we can detect a UUID in the pasted text
  const hasUuid = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(code)

  return (
    <form onSubmit={handleRejoin} className="flex gap-2">
      <input
        className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:border-gray-300 focus:outline-none transition-colors"
        placeholder="Paste your rejoin link or session ID"
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <button
        type="submit"
        disabled={!hasUuid}
        className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-2xl text-sm font-medium hover:bg-gray-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
      >
        Go →
      </button>
    </form>
  )
}
