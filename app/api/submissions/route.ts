// app/api/submissions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

// POST /api/submissions
// Body: { token: string, gender: 'girl'|'boy', names: string[] } (names[0] = rank 1)
export async function POST(req: NextRequest) {
  const { token, gender, names } = await req.json()

  if (!token || !gender || !Array.isArray(names) || names.length !== 10) {
    return NextResponse.json({ error: 'token, gender, and exactly 10 names required' }, { status: 400 })
  }
  if (!['girl', 'boy'].includes(gender)) {
    return NextResponse.json({ error: 'gender must be girl or boy' }, { status: 400 })
  }

  const db = createAdminClient()

  const { data: session, error: sessionError } = await db
    .from('sessions')
    .select('id, submitted_a, submitted_b, token_a, token_b, gender_mode')
    .or(`token_a.eq.${token},token_b.eq.${token}`)
    .single()

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  }

  const parent_slot = session.token_a === token ? 'a' : 'b'

  // Delete existing submission for this parent+gender so they can re-submit (edit their list)
  await db
    .from('submissions')
    .delete()
    .eq('session_id', session.id)
    .eq('parent_slot', parent_slot)
    .eq('gender', gender)

  const rows = names.map((name: string, i: number) => ({
    session_id: session.id,
    parent_slot,
    gender,
    name: name.trim(),
    rank: i + 1,
  }))

  const { error: insertError } = await db.from('submissions').insert(rows)
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  const { data: allSubs } = await db
    .from('submissions')
    .select('gender')
    .eq('session_id', session.id)
    .eq('parent_slot', parent_slot)

  const genderSet = new Set(allSubs?.map(s => s.gender))
  const genderMode = session.gender_mode ?? 'both'
  const doneForMode =
    genderMode === 'girls' ? genderSet.has('girl') :
    genderMode === 'boys'  ? genderSet.has('boy')  :
    genderSet.has('girl') && genderSet.has('boy')

  if (doneForMode) {
    await db
      .from('sessions')
      .update({ [`submitted_${parent_slot}`]: true })
      .eq('id', session.id)
  }

  return NextResponse.json({ ok: true, doneForMode })
}
