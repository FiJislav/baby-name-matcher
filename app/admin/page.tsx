'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Session } from '@/lib/types'
import { AdminSessionForm } from '@/components/AdminSessionForm'
import { AdminSessionList } from '@/components/AdminSessionList'

export default function AdminPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [password, setPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    const pw = sessionStorage.getItem('admin_password')
    if (!pw) { router.push('/admin/login'); return }
    setPassword(pw)
    fetch('/api/admin/sessions', {
      headers: { Authorization: `Bearer ${pw}` },
    })
      .then(r => r.json())
      .then(data => { if (data.sessions) setSessions(data.sessions) })
  }, [router])

  function handleCreated(session: Session) {
    setSessions(prev => [session, ...prev])
  }

  if (!password) return null

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Baby Name Matcher — Admin</h1>
      <AdminSessionForm adminPassword={password} onCreated={handleCreated} />
      <AdminSessionList sessions={sessions} />
    </main>
  )
}
