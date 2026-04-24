import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import IngredientFormList from './IngredientFormList'
import type { Ingredient } from '../types/Recipe'

const sampleIngredients: Ingredient[] = [
  { sortOrder: 0, name: 'Spaghetti', quantity: 200, unit: 'gram' },
]

describe('IngredientFormList', () => {
  it('renders existing ingredients', () => {
    render(<IngredientFormList ingredients={sampleIngredients} onChange={() => {}} />)
    expect(screen.getByDisplayValue('Spaghetti')).toBeInTheDocument()
  })

  it('calls onChange with new ingredient when Add is clicked', async () => {
    const onChange = vi.fn()
    render(<IngredientFormList ingredients={[]} onChange={onChange} />)
    await userEvent.click(screen.getByText(/legg til/i))
    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ name: '', unit: '' }),
    ])
  })

  it('calls onChange with ingredient removed when delete is clicked', async () => {
    const onChange = vi.fn()
    render(<IngredientFormList ingredients={sampleIngredients} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: /fjern/i }))
    expect(onChange).toHaveBeenCalledWith([])
  })

  it('calls onChange when ingredient name is edited', () => {
    const onChange = vi.fn()
    render(<IngredientFormList ingredients={sampleIngredients} onChange={onChange} />)
    const input = screen.getByDisplayValue('Spaghetti')
    fireEvent.change(input, { target: { value: 'Pasta' } })
    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ name: 'Pasta' }),
    ])
  })
})
