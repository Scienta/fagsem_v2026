import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import RecipeListPage from './RecipeListPage'

const renderPage = () =>
  render(
    <MemoryRouter>
      <RecipeListPage />
    </MemoryRouter>
  )

describe('RecipeListPage', () => {
  it('renders heading', () => {
    renderPage()
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('loads and displays recipe cards', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
      expect(screen.getByText('Laksesushi')).toBeInTheDocument()
    })
  })

  it('renders search bar', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/søk/i)).toBeInTheDocument()
    })
  })

  it('renders link to create new recipe', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /ny oppskrift/i })).toHaveAttribute('href', '/recipes/new')
  })
})
