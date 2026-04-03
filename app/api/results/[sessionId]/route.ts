// app/api/results/[sessionId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { computeResults } from '@/lib/scoring'
import { NameRecord } from '@/lib/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params
  const db = createAdminClient()

  const { data: session } = await db
    .from('sessions')
    .select('id, submitted_a, submitted_b')
    .eq('id', sessionId)
    .single()

  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  if (!session.submitted_a || !session.submitted_b) {
    return NextResponse.json({ error: 'Not all parents have submitted' }, { status: 425 })
  }

  const { data: submissions } = await db
    .from('submissions')
    .select('*')
    .eq('session_id', sessionId)

  const subA = (submissions ?? []).filter(s => s.parent_slot === 'a')
  const subB = (submissions ?? []).filter(s => s.parent_slot === 'b')

  const nameStrings = [...new Set((submissions ?? []).map(s => s.name))]
  const { data: nameRecords } = await db
    .from('names_db')
    .select('id, name, gender, meaning, origin')
    .in('name', nameStrings)

  const results = computeResults(subA as any, subB as any, (nameRecords ?? []) as NameRecord[])

  return NextResponse.json({ results })
}
