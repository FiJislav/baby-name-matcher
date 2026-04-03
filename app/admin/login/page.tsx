'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      sessionStorage.setItem('admin_password', password)
      router.push('/admin')
    } else {
      setError('Wrong password')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔐</div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:border-pink-300 focus:outline-none transition-colors"
            placeholder="Admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 to-blue-400 text-white font-semibold py-3 rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  )
}
