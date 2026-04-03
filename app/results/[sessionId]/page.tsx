import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import { computeResults } from '@/lib/scoring'
import { NameRecord } from '@/lib/types'
import { ResultsReveal } from '@/components/ResultsReveal'

interface Props {
  params: Promise<{ sessionId: string }>
}

export default async function ResultsPage({ params }: Props) {
  const { sessionId } = await params
  const db = createAdminClient()

  const { data: session } = await db
    .from('sessions')
    .select('id, submitted_a, submitted_b, name_a, name_b, gender_mode')
    .eq('id', sessionId)
    .single()

  if (!session) notFound()

  if (!session.submitted_a || !session.submitted_b) {
    return (
      <main className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-3xl font-bold mb-4">Not ready yet...</h1>
          <p className="text-gray-500">Both parents need to submit before the results are available.</p>
        </div>
      </main>
    )
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

  return (
    <ResultsReveal
      results={results}
      nameA={session.name_a ?? 'Parent A'}
      nameB={session.name_b ?? 'Parent B'}
      genderMode={session.gender_mode ?? 'both'}
    />
  )
}
