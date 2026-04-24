import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import FlavorTagSelector from './FlavorTagSelector'

describe('FlavorTagSelector', () => {
  it('renders all flavor options', () => {
    render(<FlavorTagSelector selected={[]} onChange={() => {}} />)
    expect(screen.getByLabelText('SPICY')).toBeInTheDocument()
    expect(screen.getByLabelText('SWEET')).toBeInTheDocument()
    expect(screen.getByLabelText('SOUR')).toBeInTheDocument()
  })

  it('marks selected tags as checked', () => {
    render(<FlavorTagSelector selected={['SPICY', 'SWEET']} onChange={() => {}} />)
    expect(screen.getByLabelText('SPICY')).toBeChecked()
    expect(screen.getByLabelText('SWEET')).toBeChecked()
    expect(screen.getByLabelText('SOUR')).not.toBeChecked()
  })

  it('calls onChange with added tag when checking', async () => {
    const onChange = vi.fn()
    render(<FlavorTagSelector selected={[]} onChange={onChange} />)
    await userEvent.click(screen.getByLabelText('SPICY'))
    expect(onChange).toHaveBeenCalledWith(['SPICY'])
  })

  it('calls onChange with removed tag when unchecking', async () => {
    const onChange = vi.fn()
    render(<FlavorTagSelector selected={['SPICY']} onChange={onChange} />)
    await userEvent.click(screen.getByLabelText('SPICY'))
    expect(onChange).toHaveBeenCalledWith([])
  })
})
