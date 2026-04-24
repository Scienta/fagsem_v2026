import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import RecipeSearchBar from './RecipeSearchBar'

describe('RecipeSearchBar', () => {
  it('renders search input', () => {
    render(<RecipeSearchBar params={{}} onChange={() => {}} categories={[]} cuisines={[]} />)
    expect(screen.getByPlaceholderText(/søk/i)).toBeInTheDocument()
  })

  it('calls onChange with updated q when text is typed', () => {
    const onChange = vi.fn()
    render(<RecipeSearchBar params={{}} onChange={onChange} categories={[]} cuisines={[]} />)
    fireEvent.change(screen.getByPlaceholderText(/søk/i), { target: { value: 'pasta' } })
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ q: 'pasta' }))
  })

  it('renders category dropdown with provided options', () => {
    render(
      <RecipeSearchBar
        params={{}}
        onChange={() => {}}
        categories={['FORRETT', 'HOVEDRETT']}
        cuisines={[]}
      />
    )
    expect(screen.getByRole('option', { name: 'FORRETT' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'HOVEDRETT' })).toBeInTheDocument()
  })

  it('calls onChange with category when category is selected', async () => {
    const onChange = vi.fn()
    render(
      <RecipeSearchBar
        params={{}}
        onChange={onChange}
        categories={['FORRETT', 'HOVEDRETT']}
        cuisines={[]}
      />
    )
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /kategori/i }), 'FORRETT')
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ category: 'FORRETT' }))
  })
})
