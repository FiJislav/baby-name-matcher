// app/api/names/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

// GET /api/names?gender=girl&country=CZ&search=em&sort=popularity
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const gender = searchParams.get('gender')
  const country = searchParams.get('country')
  const search = searchParams.get('search') ?? ''
  const sortByPopularity = searchParams.get('sort') === 'popularity'

  const db = createAdminClient()

  let query = db
    .from('names_db')
    .select(`
      id, name, gender, meaning, origin,
      name_popularity (country_code, popularity_rank, year)
    `)

  if (gender && gender !== 'neutral') {
    query = query.in('gender', [gender, 'neutral'])
  }
  if (search) {
    query = query.ilike('name', `${search}%`)
  }

  const { data, error } = await query.order('name')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const names = data ?? []

  const namesWithPop = names.map(n => ({
    ...n,
    popularity: (n.name_popularity as any[])
      .filter(p => !country || p.country_code === country)
      .map(p => ({ country_code: p.country_code, rank: p.popularity_rank, year: p.year })),
  }))

  // When a country is selected, only show names that have data for that country
  const filtered = country
    ? namesWithPop.filter(n => n.popularity.length > 0)
    : namesWithPop

  if (sortByPopularity && country) {
    filtered.sort((a, b) => {
      const rankA = a.popularity[0]?.rank ?? 9999
      const rankB = b.popularity[0]?.rank ?? 9999
      return rankA - rankB
    })
  }

  return NextResponse.json({ names: filtered })
}
