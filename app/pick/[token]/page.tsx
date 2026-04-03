import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import { NamePickerShell } from '@/components/NamePickerShell'

interface Props {
  params: Promise<{ token: string }>
}

export default async function PickPage({ params }: Props) {
  const { token } = await params
  const db = createAdminClient()

  const { data: session } = await db
    .from('sessions')
    .select('id, submitted_a, submitted_b, token_a, token_b, gender_mode')
    .or(`token_a.eq.${token},token_b.eq.${token}`)
    .single()

  if (!session) notFound()

  const parentSlot = session.token_a === token ? 'a' : 'b'
  const partnerSubmitted = parentSlot === 'a' ? session.submitted_b : session.submitted_a

  return (
    <NamePickerShell
      token={token}
      sessionId={session.id}
      partnerSubmitted={partnerSubmitted}
      genderMode={session.gender_mode ?? 'both'}
    />
  )
}
