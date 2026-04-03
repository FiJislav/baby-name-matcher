'use client'
import { Session } from '@/lib/types'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? ''

interface Props {
  sessions: Session[]
}

export function AdminSessionList({ sessions }: Props) {
  function copyLink(url: string) {
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Sessions</h2>
      {sessions.length === 0 && <p className="text-gray-500">No sessions yet.</p>}
      <div className="flex flex-col gap-4">
        {sessions.map(s => {
          const linkA = `${BASE_URL}/pick/${s.token_a}`
          const linkB = `${BASE_URL}/pick/${s.token_b}`
          const status = s.submitted_a && s.submitted_b
            ? '✅ Both submitted'
            : s.submitted_a
            ? '⏳ Waiting for B'
            : s.submitted_b
            ? '⏳ Waiting for A'
            : '⏳ Waiting for both'
          return (
            <div key={s.id} className="border rounded p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{s.label}</p>
                  <p className="text-sm text-gray-500">
                    {s.due_date ? `Due: ${s.due_date}` : 'No due date'} · {new Date(s.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-1">{status}</p>
                </div>
                {s.submitted_a && s.submitted_b && (
                  <a
                    href={`/results/${s.id}`}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded"
                    target="_blank"
                  >
                    View Results
                  </a>
                )}
              </div>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-20">Parent A:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded flex-1 truncate">{linkA}</code>
                  <button onClick={() => copyLink(linkA)} className="text-blue-600 hover:underline">Copy</button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-20">Parent B:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded flex-1 truncate">{linkB}</code>
                  <button onClick={() => copyLink(linkB)} className="text-blue-600 hover:underline">Copy</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
