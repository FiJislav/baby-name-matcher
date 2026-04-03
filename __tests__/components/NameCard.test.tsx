import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NameCard } from '@/components/NameCard'
import { NameWithPopularity } from '@/lib/types'

const name: NameWithPopularity = {
  id: '1',
  name: 'Emma',
  gender: 'girl',
  meaning: 'Whole, universal',
  origin: 'Germanic',
  popularity: [{ country_code: 'CZ', rank: 3, year: 2024 }],
}

describe('NameCard', () => {
  it('displays the name', () => {
    render(<NameCard name={name} onAdd={jest.fn()} disabled={false} />)
    expect(screen.getByText('Emma')).toBeInTheDocument()
  })

  it('displays meaning and origin', () => {
    render(<NameCard name={name} onAdd={jest.fn()} disabled={false} />)
    expect(screen.getByText(/Whole, universal/)).toBeInTheDocument()
    expect(screen.getByText(/Germanic/)).toBeInTheDocument()
  })

  it('displays popularity when available', () => {
    render(<NameCard name={name} onAdd={jest.fn()} disabled={false} />)
    expect(screen.getByText(/#3 in CZ 2024/)).toBeInTheDocument()
  })

  it('calls onAdd when Add button is clicked', async () => {
    const onAdd = jest.fn()
    render(<NameCard name={name} onAdd={onAdd} disabled={false} />)
    await userEvent.click(screen.getByRole('button', { name: /add/i }))
    expect(onAdd).toHaveBeenCalledWith('Emma')
  })

  it('disables Add button when disabled prop is true', () => {
    render(<NameCard name={name} onAdd={jest.fn()} disabled={true} />)
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled()
  })
})
