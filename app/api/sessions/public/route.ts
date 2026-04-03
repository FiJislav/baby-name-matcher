import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { inviteCode, label } = await req.json()

  if (!inviteCode || inviteCode !== process.env.INVITE_CODE) {
    return NextResponse.json({ error: 'Invalid invite code' }, { status: 401 })
  }

  const db = createAdminClient()
  const { data, error } = await db
    .from('sessions')
    .insert({ label: label?.trim() || 'Our family' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ session: data }, { status: 201 })
}
