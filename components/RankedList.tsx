'use client'
import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { RankedEntry } from '@/lib/types'

interface Props {
  entries: RankedEntry[]
  onReorder: (newEntries: RankedEntry[]) => void
  onRemove: (index: number) => void
  onAddCustom: (name: string) => void
}

export function RankedList({ entries, onReorder, onRemove, onAddCustom }: Props) {
  const [customInput, setCustomInput] = useState('')

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return
    const reordered = Array.from(entries)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    onReorder(reordered)
  }

  function handleCustomKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && customInput.trim()) {
      onAddCustom(customInput.trim())
      setCustomInput('')
    }
  }

  const slots = Array.from({ length: 10 }, (_, i) => entries[i] ?? null)

  return (
    <div className="flex flex-col gap-2">
      <input
        className="w-full border-2 border-blue-100 dark:border-[#352a50] dark:bg-[#241c38] dark:text-[#e2d5f0] dark:placeholder-[#7c6d9a] rounded-2xl px-4 py-3 text-sm focus:border-blue-300 dark:focus:border-purple-500 focus:outline-none transition-colors placeholder-gray-400"
        placeholder="Type a name not in the list and press Enter"
        value={customInput}
        onChange={e => setCustomInput(e.target.value)}
        onKeyDown={handleCustomKeyDown}
      />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="ranked-list">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-1.5">
              {slots.map((entry, i) =>
                entry ? (
                  <Draggable key={entry.name} draggableId={entry.name} index={i}>
                    {(drag) => (
                      <div
                        ref={drag.innerRef}
                        {...drag.draggableProps}
                        {...drag.dragHandleProps}
                        className="flex items-center gap-2 bg-white dark:bg-[#1a1428] border-2 border-pink-100 dark:border-[#352a50] rounded-2xl px-3 py-2.5 shadow-sm hover:border-pink-300 dark:hover:border-purple-600 transition-all cursor-grab active:cursor-grabbing"
                      >
                        <span className="w-7 h-7 flex items-center justify-center bg-gradient-to-br from-pink-400 to-blue-400 dark:from-[#c026d3] dark:to-[#9333ea] text-white text-xs font-bold rounded-full shrink-0">{i + 1}</span>
                        <span className="flex-1 font-semibold text-gray-800 dark:text-[#e2d5f0]">{entry.name}</span>
                        {!entry.isCustom && (
                          <span className="text-xs text-gray-400 dark:text-[#7c6d9a]">{entry.origin}</span>
                        )}
                        <button
                          onClick={() => onRemove(i)}
                          className="text-gray-300 dark:text-[#4a3870] hover:text-red-400 dark:hover:text-red-400 text-xl leading-none transition-colors"
                          aria-label="×"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </Draggable>
                ) : (
                  <div
                    key={`empty-${i}`}
                    className="flex items-center gap-2 border-2 border-dashed border-gray-200 dark:border-[#352a50] rounded-2xl px-3 py-2.5 text-gray-300 dark:text-[#352a50]"
                  >
                    <span className="w-7 h-7 flex items-center justify-center bg-gray-100 dark:bg-[#241c38] text-gray-400 dark:text-[#7c6d9a] text-xs font-bold rounded-full shrink-0">{i + 1}</span>
                    <span className="text-sm">empty slot</span>
                  </div>
                )
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
