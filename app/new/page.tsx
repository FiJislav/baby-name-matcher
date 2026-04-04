'use client'
import { useEffect, useState } from 'react'
import { GenderMode, Session } from '@/lib/types'
import { BuyMeCoffee } from '@/components/BuyMeCoffee'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? ''

const GENDER_OPTIONS: { value: GenderMode; label: string; icon: string }[] = [
  { value: 'girls', label: 'Girls only', icon: '👧' },
  { value: 'both',  label: 'Both',       icon: '👶' },
  { value: 'boys',  label: 'Boys only',  icon: '👦' },
]

function SessionLinks({ session: initial }: { session: Session }) {
  const [session, setSession] = useState(initial)
  const [copiedB, setCopiedB] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

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
    setCopiedB(true); setTimeout(() => setCopiedB(false), 2000)
  }
  function copyCode() {
    navigator.clipboard.writeText(`${BASE_URL}/rejoin/${session.id}`)
    setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000)
  }

  const shortCode = session.id.split('-')[0].toUpperCase()

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white dark:bg-[#1a1428] rounded-3xl shadow-xl dark:shadow-none dark:border dark:border-[#352a50] p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Your session is ready!</h1>
        <p className="text-gray-500 dark:text-[#7c6d9a] mb-6">Each of you tap your button to start picking names</p>

        <div className="flex flex-col gap-3">
          <ParentButton href={`/pick/${session.token_a}`} name={session.name_a} submitted={session.submitted_a}
            gradient="from-pink-400 to-pink-500" icon="👩" />
          <ParentButton href={`/pick/${session.token_b}`} name={session.name_b} submitted={session.submitted_b}
            gradient="from-blue-400 to-blue-500 dark:from-[#c026d3] dark:to-[#9333ea]" icon="👨" />
          <button onClick={copyB} className="w-full border-2 border-blue-300 dark:border-purple-700 text-blue-500 dark:text-purple-400 font-medium py-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-[#241c38] transition-all">
            {copiedB ? '✅ Copied!' : `📋 Copy ${session.name_b}'s link to share`}
          </button>
        </div>

        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-[#352a50]">
          <p className="text-xs text-gray-400 dark:text-[#7c6d9a] mb-2">Session code — save this to come back later</p>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#241c38] rounded-2xl px-4 py-3">
            <span className="font-mono text-sm font-bold text-gray-700 dark:text-[#e2d5f0] flex-1 text-left tracking-widest">{shortCode}</span>
            <button onClick={copyCode} className="text-xs text-gray-400 dark:text-[#7c6d9a] hover:text-gray-600 dark:hover:text-[#c084fc] transition-colors">
              {copiedCode ? '✅ Copied' : '📋 Copy link'}
            </button>
          </div>
          <a href={`/rejoin/${session.id}`} className="block text-xs text-pink-400 dark:text-purple-400 hover:text-pink-500 mt-2 transition-colors">
            /rejoin/{shortCode}... →
          </a>
        </div>

        <p className="text-xs text-gray-400 dark:text-[#7c6d9a] mt-4">
          Tip: Copy {session.name_b}&apos;s link and send it before tapping your own button
        </p>
      </div>
    </main>
  )
}

function ParentButton({ href, name, submitted, gradient, icon }: {
  href: string; name: string; submitted: boolean; gradient: string; icon: string
}) {
  return (
    <a href={href} className={`block w-full bg-gradient-to-r ${submitted ? 'from-green-400 to-emerald-500' : gradient} text-white text-base font-semibold py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all`}>
      {submitted ? `✅ ${name} submitted — tap to edit` : `${icon} I am ${name} — Start Picking!`}
    </a>
  )
}

function RejoinInput() {
  const [code, setCode] = useState('')
  const hasUuid = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(code)

  function handleRejoin(e: React.FormEvent) {
    e.preventDefault()
    const match = code.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)
    if (match) window.location.href = `/rejoin/${match[0]}`
  }

  return (
    <form onSubmit={handleRejoin} className="flex gap-2">
      <input
        className="flex-1 border-2 border-gray-200 dark:border-[#352a50] dark:bg-[#241c38] dark:text-[#e2d5f0] dark:placeholder-[#7c6d9a] rounded-2xl px-4 py-2.5 text-sm focus:border-gray-300 dark:focus:border-purple-500 focus:outline-none transition-colors"
        placeholder="Paste your rejoin link or session ID"
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <button type="submit" disabled={!hasUuid}
        className="px-4 py-2.5 bg-gray-100 dark:bg-[#241c38] text-gray-600 dark:text-[#c084fc] rounded-2xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-[#352a50] transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap">
        Go →
      </button>
    </form>
  )
}

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
    setLoading(true); setError('')
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
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full flex flex-col gap-5">

        {/* Hero header */}
        <div className="text-center px-4">
          <div className="text-5xl mb-3">👶</div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white leading-tight">
            Can&apos;t agree on a baby name?
          </h1>
          <p className="text-gray-500 dark:text-[#7c6d9a] mt-3 text-sm leading-relaxed">
            You&apos;re not alone. We were there too — one of us loved <em>Maximilian</em>,
            the other wanted something that &quot;doesn&apos;t sound like a Roman emperor.&quot;
            Three weeks of negotiations. Zero agreement.
          </p>
          <p className="text-gray-500 dark:text-[#7c6d9a] mt-2 text-sm leading-relaxed">
            So I built this. Each parent ranks their top 10 names <strong className="text-gray-700 dark:text-[#e2d5f0]">independently</strong> —
            no peeking, no influencing — and the app finds where you actually agree.
            Science applied to parenting. You&apos;re welcome. 🧪
          </p>
        </div>

        {/* Form card — narrower than the header */}
        <div className="bg-white dark:bg-[#1a1428] rounded-3xl shadow-xl dark:shadow-none dark:border dark:border-[#352a50] p-8 max-w-md w-full mx-auto">
        <form onSubmit={handleCreate} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-[#c084fc] mb-1">Invite code</label>
            <input
              className="w-full border-2 border-gray-200 dark:border-[#352a50] dark:bg-[#241c38] dark:text-[#e2d5f0] dark:placeholder-[#7c6d9a] rounded-2xl px-4 py-3 focus:border-pink-300 dark:focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="Enter your invite code"
              value={inviteCode} onChange={e => setInviteCode(e.target.value)} required
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 dark:text-[#c084fc] mb-1">
                <span className="text-pink-400">♀</span> Your name
              </label>
              <input
                className="w-full border-2 border-gray-200 dark:border-[#352a50] dark:bg-[#241c38] dark:text-[#e2d5f0] dark:placeholder-[#7c6d9a] rounded-2xl px-4 py-3 focus:border-pink-300 dark:focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="e.g. Anna" value={nameA} onChange={e => setNameA(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 dark:text-[#c084fc] mb-1">
                <span className="text-blue-400 dark:text-purple-400">♂</span> Partner&apos;s name
              </label>
              <input
                className="w-full border-2 border-gray-200 dark:border-[#352a50] dark:bg-[#241c38] dark:text-[#e2d5f0] dark:placeholder-[#7c6d9a] rounded-2xl px-4 py-3 focus:border-blue-300 dark:focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="e.g. Martin" value={nameB} onChange={e => setNameB(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-[#c084fc] mb-2">Do you know the gender?</label>
            <div className="grid grid-cols-3 gap-2">
              {GENDER_OPTIONS.map(opt => (
                <button key={opt.value} type="button" onClick={() => setGenderMode(opt.value)}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 text-center transition-all ${
                    genderMode === opt.value
                      ? opt.value === 'girls'
                        ? 'border-pink-400 bg-pink-50 dark:bg-[#2d1628] text-pink-700 dark:text-[#f0abcb]'
                        : opt.value === 'boys'
                        ? 'border-blue-400 dark:border-purple-600 bg-blue-50 dark:bg-[#1e1a38] text-blue-700 dark:text-purple-300'
                        : 'border-purple-400 bg-purple-50 dark:bg-[#241c38] text-purple-700 dark:text-[#c084fc]'
                      : 'border-gray-200 dark:border-[#352a50] bg-white dark:bg-[#1a1428] text-gray-500 dark:text-[#7c6d9a] hover:border-gray-300 dark:hover:border-[#4a3870]'
                  }`}>
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-xs font-semibold leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-[#c084fc] mb-1">
              Family name <span className="text-gray-400 dark:text-[#4a3870]">(optional)</span>
            </label>
            <input
              className="w-full border-2 border-gray-200 dark:border-[#352a50] dark:bg-[#241c38] dark:text-[#e2d5f0] dark:placeholder-[#7c6d9a] rounded-2xl px-4 py-3 focus:border-pink-300 dark:focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="e.g. Smith family" value={label} onChange={e => setLabel(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-950 py-2 rounded-xl">
              {error === 'Invalid invite code' ? '❌ Wrong invite code — check with whoever sent you this link' : error}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-pink-400 to-blue-400 dark:from-[#c026d3] dark:to-[#9333ea] text-white text-lg font-semibold py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 mt-1">
            {loading ? '✨ Creating...' : '✨ Create Our Session'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#352a50]">
          <p className="text-xs text-gray-400 dark:text-[#7c6d9a] text-center mb-3">Already have a session?</p>
          <RejoinInput />
        </div>

        <BuyMeCoffee />
        </div>
      </div>
    </main>
  )
}
