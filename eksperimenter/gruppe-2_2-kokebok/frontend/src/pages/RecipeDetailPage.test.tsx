import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import RecipeDetailPage from './RecipeDetailPage'

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/recipes/1']}>
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
      </Routes>
    </MemoryRouter>
  )

describe('RecipeDetailPage', () => {
  it('loads and displays recipe title', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
    })
  })

  it('displays ingredients', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Spaghetti')).toBeInTheDocument()
    })
  })

  it('displays cooking steps', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Kok pastaen i saltet vann')).toBeInTheDocument()
    })
  })

  it('renders edit link', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /rediger/i })).toHaveAttribute('href', '/recipes/1/edit')
    })
  })

  it('displays cuisine and category', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Italiensk')).toBeInTheDocument()
      expect(screen.getByText('HOVEDRETT')).toBeInTheDocument()
    })
  })
})
