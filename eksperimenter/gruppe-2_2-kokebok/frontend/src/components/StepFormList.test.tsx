import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import StepFormList from './StepFormList'
import type { RecipeStep } from '../types/Recipe'

const sampleSteps: RecipeStep[] = [
  { stepNumber: 1, instruction: 'Kok vann' },
  { stepNumber: 2, instruction: 'Tilsett pasta' },
]

describe('StepFormList', () => {
  it('renders existing steps', () => {
    render(<StepFormList steps={sampleSteps} onChange={() => {}} />)
    expect(screen.getByDisplayValue('Kok vann')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Tilsett pasta')).toBeInTheDocument()
  })

  it('adds a new empty step when Add is clicked', async () => {
    const onChange = vi.fn()
    render(<StepFormList steps={sampleSteps} onChange={onChange} />)
    await userEvent.click(screen.getByText(/legg til/i))
    expect(onChange).toHaveBeenCalledWith([
      ...sampleSteps,
      expect.objectContaining({ stepNumber: 3, instruction: '' }),
    ])
  })

  it('removes a step when delete is clicked', async () => {
    const onChange = vi.fn()
    render(<StepFormList steps={sampleSteps} onChange={onChange} />)
    const removeButtons = screen.getAllByRole('button', { name: /fjern/i })
    await userEvent.click(removeButtons[0])
    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ instruction: 'Tilsett pasta', stepNumber: 1 }),
    ])
  })

  it('updates instruction when edited', () => {
    const onChange = vi.fn()
    render(<StepFormList steps={[{ stepNumber: 1, instruction: 'Initial' }]} onChange={onChange} />)
    const textarea = screen.getByDisplayValue('Initial')
    fireEvent.change(textarea, { target: { value: 'New instruction' } })
    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ instruction: 'New instruction' }),
    ])
  })
})
