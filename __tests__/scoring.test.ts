// __tests__/scoring.test.ts
import { computeScore, computeResults } from '../lib/scoring'
import { Submission, NameRecord } from '../lib/types'

const base = {
  id: '1',
  session_id: 'session-1',
  submitted_at: '2026-04-02T00:00:00Z',
}

const names: NameRecord[] = [
  { id: '1', name: 'Emma',  gender: 'girl', meaning: 'Whole',  origin: 'Germanic' },
  { id: '2', name: 'Sofia', gender: 'girl', meaning: 'Wisdom', origin: 'Greek' },
  { id: '3', name: 'Anna',  gender: 'girl', meaning: 'Grace',  origin: 'Hebrew' },
]

describe('computeScore', () => {
  it('gives 10 points for rank 1', () => {
    expect(computeScore(1)).toBe(10)
  })
  it('gives 1 point for rank 10', () => {
    expect(computeScore(10)).toBe(1)
  })
  it('gives 5 points for rank 6', () => {
    expect(computeScore(6)).toBe(5)
  })
})

describe('computeResults', () => {
  it('combines scores from both parents correctly', () => {
    const subA: Submission[] = [
      { ...base, id: 'a1', parent_slot: 'a', gender: 'girl', name: 'Emma',  rank: 1 },
      { ...base, id: 'a2', parent_slot: 'a', gender: 'girl', name: 'Sofia', rank: 2 },
    ]
    const subB: Submission[] = [
      { ...base, id: 'b1', parent_slot: 'b', gender: 'girl', name: 'Emma', rank: 2 },
      { ...base, id: 'b2', parent_slot: 'b', gender: 'girl', name: 'Anna', rank: 1 },
    ]

    const results = computeResults(subA, subB, names)
    expect(results.girls[0].name).toBe('Emma')  // 10 + 9 = 19
    expect(results.girls[0].score).toBe(19)
    expect(results.girls[0].rank_a).toBe(1)
    expect(results.girls[0].rank_b).toBe(2)
  })

  it('returns empty arrays when no submissions', () => {
    const results = computeResults([], [], names)
    expect(results.girls).toHaveLength(0)
    expect(results.boys).toHaveLength(0)
  })

  it('includes names only one parent picked with their solo score', () => {
    const subA: Submission[] = [
      { ...base, id: 'a1', parent_slot: 'a', gender: 'girl', name: 'Emma', rank: 1 },
    ]
    const results = computeResults(subA, [], names)
    expect(results.girls[0].name).toBe('Emma')
    expect(results.girls[0].score).toBe(10)
    expect(results.girls[0].rank_b).toBeNull()
  })

  it('sorts results by descending score', () => {
    const subA: Submission[] = [
      { ...base, id: 'a1', parent_slot: 'a', gender: 'girl', name: 'Emma',  rank: 1 },
      { ...base, id: 'a2', parent_slot: 'a', gender: 'girl', name: 'Sofia', rank: 2 },
      { ...base, id: 'a3', parent_slot: 'a', gender: 'girl', name: 'Anna',  rank: 3 },
    ]
    const subB: Submission[] = [
      { ...base, id: 'b1', parent_slot: 'b', gender: 'girl', name: 'Anna',  rank: 1 },
      { ...base, id: 'b2', parent_slot: 'b', gender: 'girl', name: 'Sofia', rank: 2 },
      { ...base, id: 'b3', parent_slot: 'b', gender: 'girl', name: 'Emma',  rank: 3 },
    ]
    const results = computeResults(subA, subB, names)
    const scores = results.girls.map(n => n.score)
    expect(scores).toEqual([...scores].sort((a, b) => b - a))
  })

  it('separates girls and boys results', () => {
    const subA: Submission[] = [
      { ...base, id: 'a1', parent_slot: 'a', gender: 'boy', name: 'Liam', rank: 1 },
    ]
    const results = computeResults(subA, [], names)
    expect(results.girls).toHaveLength(0)
    expect(results.boys[0].name).toBe('Liam')
  })

  it('attaches meaning and origin from name records', () => {
    const subA: Submission[] = [
      { ...base, id: 'a1', parent_slot: 'a', gender: 'girl', name: 'Emma', rank: 1 },
    ]
    const results = computeResults(subA, [], names)
    expect(results.girls[0].meaning).toBe('Whole')
    expect(results.girls[0].origin).toBe('Germanic')
  })

  it('leaves meaning empty for custom names not in name records', () => {
    const subA: Submission[] = [
      { ...base, id: 'a1', parent_slot: 'a', gender: 'girl', name: 'Xanthe', rank: 1 },
    ]
    const results = computeResults(subA, [], names)
    expect(results.girls[0].meaning).toBe('')
  })
})
