// app/api/admin/sessions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

function checkAdminAuth(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''
  const token = auth.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

// GET /api/admin/sessions — list all sessions
export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createAdminClient()
  const { data, error } = await db
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ sessions: data })
}

// POST /api/admin/sessions — create new session
export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { label, due_date } = await req.json()
  if (!label?.trim()) return NextResponse.json({ error: 'label is required' }, { status: 400 })

  const db = createAdminClient()
  const { data, error } = await db
    .from('sessions')
    .insert({ label: label.trim(), due_date: due_date || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ session: data }, { status: 201 })
}
