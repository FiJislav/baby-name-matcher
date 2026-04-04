'use client'
import { NameWithPopularity } from '@/lib/types'

interface Props {
  name: NameWithPopularity
  onAdd: (name: string) => void
  disabled: boolean
  gender?: 'girl' | 'boy'
}

export function NameCard({ name, onAdd, disabled, gender = 'girl' }: Props) {
  const pop = name.popularity[0]
  const isBoy = gender === 'boy'

  return (
    <div className={`bg-white dark:bg-[#1a1428] border-2 rounded-2xl p-3 flex justify-between items-start gap-3 hover:shadow-md transition-all ${
      isBoy
        ? 'border-blue-100 dark:border-[#1a2a50] hover:border-blue-300 dark:hover:border-blue-700'
        : 'border-pink-100 dark:border-[#352a50] hover:border-pink-300 dark:hover:border-purple-600'
    }`}>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 dark:text-white text-lg leading-tight">{name.name}</p>
        <p className="text-sm text-gray-500 dark:text-[#7c6d9a] mt-0.5 truncate">
          {name.meaning} · <span className={isBoy ? 'text-blue-400 dark:text-blue-300' : 'text-pink-400 dark:text-[#f0abcb]'}>{name.origin}</span>
        </p>
        {pop && (
          <p className="text-xs text-blue-400 dark:text-purple-400 mt-1 font-medium">
            #{pop.rank} in {pop.country_code} {pop.year}
          </p>
        )}
      </div>
      <button
        onClick={() => onAdd(name.name)}
        disabled={disabled}
        className={`shrink-0 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed ${
          isBoy
            ? 'bg-gradient-to-r from-blue-400 to-blue-500 dark:from-[#c026d3] dark:to-[#9333ea]'
            : 'bg-gradient-to-r from-pink-400 to-pink-500 dark:from-[#c026d3] dark:to-[#9333ea]'
        }`}
      >
        + Add
      </button>
    </div>
  )
}
