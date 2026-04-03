// lib/types.ts

export type Gender = 'girl' | 'boy' | 'neutral'
export type ParentSlot = 'a' | 'b'

export type GenderMode = 'both' | 'girls' | 'boys'

export interface Session {
  id: string
  label: string
  name_a: string
  name_b: string
  gender_mode: GenderMode
  due_date: string | null
  submitted_a: boolean
  submitted_b: boolean
  token_a: string
  token_b: string
  created_at: string
}

export interface Submission {
  id: string
  session_id: string
  parent_slot: ParentSlot
  gender: 'girl' | 'boy'
  name: string
  rank: number
  submitted_at: string
}

export interface NameRecord {
  id: string
  name: string
  gender: Gender
  meaning: string
  origin: string
}

export interface NamePopularity {
  id: string
  name_id: string
  country_code: string
  popularity_rank: number
  year: number
}

export interface NameWithPopularity extends NameRecord {
  popularity: { country_code: string; rank: number; year: number }[]
}

export interface ScoredName {
  name: string
  score: number
  rank_a: number | null
  rank_b: number | null
  meaning: string
  origin: string
}

export interface MatchResults {
  girls: ScoredName[]
  boys: ScoredName[]
}

export interface RankedEntry {
  name: string
  meaning: string
  origin: string
  isCustom: boolean
}
