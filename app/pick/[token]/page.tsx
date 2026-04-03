import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import { NamePickerShell } from '@/components/NamePickerShell'

interface Props {
  params: { token: string }
}

export default async function PickPage({ params }: Props) {
  const db = createAdminClient()

  const { data: session } = await db
    .from('sessions')
    .select('id, submitted_a, submitted_b, token_a, token_b')
    .or(`token_a.eq.${params.token},token_b.eq.${params.token}`)
    .single()

  if (!session) notFound()

  const parentSlot = session.token_a === params.token ? 'a' : 'b'
  const partnerSubmitted = parentSlot === 'a' ? session.submitted_b : session.submitted_a

  return (
    <NamePickerShell
      token={params.token}
      sessionId={session.id}
      partnerSubmitted={partnerSubmitted}
    />
  )
}
