jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: any) => children,
  Droppable: ({ children }: any) => children({ innerRef: jest.fn(), droppableProps: {}, placeholder: null }, {}),
  Draggable: ({ children }: any) => children({ innerRef: jest.fn(), draggableProps: {}, dragHandleProps: {} }, {}),
}))

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RankedList } from '@/components/RankedList'
import { RankedEntry } from '@/lib/types'

const twoEntries: RankedEntry[] = [
  { name: 'Emma',  meaning: 'Whole', origin: 'Germanic', isCustom: false },
  { name: 'Sofia', meaning: 'Wisdom', origin: 'Greek',   isCustom: false },
]

describe('RankedList', () => {
  it('renders 10 numbered slots', () => {
    render(<RankedList entries={[]} onReorder={jest.fn()} onRemove={jest.fn()} onAddCustom={jest.fn()} />)
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument()
    }
  })

  it('shows name in the correct slot', () => {
    render(<RankedList entries={twoEntries} onReorder={jest.fn()} onRemove={jest.fn()} onAddCustom={jest.fn()} />)
    expect(screen.getByText('Emma')).toBeInTheDocument()
    expect(screen.getByText('Sofia')).toBeInTheDocument()
  })

  it('calls onRemove with correct index when × clicked', async () => {
    const onRemove = jest.fn()
    render(<RankedList entries={twoEntries} onReorder={jest.fn()} onRemove={onRemove} onAddCustom={jest.fn()} />)
    const removeButtons = screen.getAllByRole('button', { name: '×' })
    await userEvent.click(removeButtons[0])
    expect(onRemove).toHaveBeenCalledWith(0)
  })

  it('shows custom name input field', () => {
    render(<RankedList entries={[]} onReorder={jest.fn()} onRemove={jest.fn()} onAddCustom={jest.fn()} />)
    expect(screen.getByPlaceholderText(/type a name/i)).toBeInTheDocument()
  })

  it('calls onAddCustom when Enter pressed in custom input', async () => {
    const onAddCustom = jest.fn()
    render(<RankedList entries={[]} onReorder={jest.fn()} onRemove={jest.fn()} onAddCustom={onAddCustom} />)
    const input = screen.getByPlaceholderText(/type a name/i)
    await userEvent.type(input, 'Xanthe{Enter}')
    expect(onAddCustom).toHaveBeenCalledWith('Xanthe')
  })
})
