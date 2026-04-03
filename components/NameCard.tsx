'use client'
import { NameWithPopularity } from '@/lib/types'

interface Props {
  name: NameWithPopularity
  onAdd: (name: string) => void
  disabled: boolean
}

export function NameCard({ name, onAdd, disabled }: Props) {
  const pop = name.popularity[0]

  return (
    <div className="border rounded-lg p-3 flex justify-between items-start gap-3 hover:shadow-sm transition-shadow">
      <div>
        <p className="font-semibold text-lg">{name.name}</p>
        <p className="text-sm text-gray-600">{name.meaning} · {name.origin}</p>
        {pop && (
          <p className="text-xs text-blue-500 mt-1">
            #{pop.rank} in {pop.country_code} {pop.year}
          </p>
        )}
      </div>
      <button
        onClick={() => onAdd(name.name)}
        disabled={disabled}
        className="shrink-0 bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        + Add
      </button>
    </div>
  )
}
