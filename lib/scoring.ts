// lib/scoring.ts
import { Submission, NameRecord, ScoredName, MatchResults } from './types'

export function computeScore(rank: number): number {
  return 11 - rank
}

export function computeResults(
  submissionsA: Submission[],
  submissionsB: Submission[],
  nameRecords: NameRecord[]
): MatchResults {
  const nameMap = new Map(nameRecords.map(n => [n.name.toLowerCase(), n]))

  function scoreGender(gender: 'girl' | 'boy'): ScoredName[] {
    const listA = submissionsA.filter(s => s.gender === gender)
    const listB = submissionsB.filter(s => s.gender === gender)
    const allNames = new Set([...listA.map(s => s.name), ...listB.map(s => s.name)])

    const scored: ScoredName[] = []
    for (const name of allNames) {
      const subA = listA.find(s => s.name === name)
      const subB = listB.find(s => s.name === name)
      const record = nameMap.get(name.toLowerCase())
      scored.push({
        name,
        score: (subA ? computeScore(subA.rank) : 0) + (subB ? computeScore(subB.rank) : 0),
        rank_a: subA?.rank ?? null,
        rank_b: subB?.rank ?? null,
        meaning: record?.meaning ?? '',
        origin: record?.origin ?? '',
      })
    }
    return scored.sort((a, b) => b.score - a.score)
  }

  return {
    girls: scoreGender('girl'),
    boys: scoreGender('boy'),
  }
}
