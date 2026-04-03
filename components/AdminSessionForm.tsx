'use client'
import { useState } from 'react'
import { Session } from '@/lib/types'

interface Props {
  adminPassword: string
  onCreated: (session: Session) => void
}

export function AdminSessionForm({ adminPassword, onCreated }: Props) {
  const [label, setLabel] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminPassword}`,
      },
      body: JSON.stringify({ label, due_date: dueDate || null }),
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) { setError(json.error); return }
    setLabel('')
    setDueDate('')
    onCreated(json.session)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
      <h2 className="text-xl font-semibold">Create New Session</h2>
      <input
        className="border rounded px-3 py-2"
        placeholder="Couple name (e.g. Novák family)"
        value={label}
        onChange={e => setLabel(e.target.value)}
        required
      />
      <input
        className="border rounded px-3 py-2"
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Session'}
      </button>
    </form>
  )
}
