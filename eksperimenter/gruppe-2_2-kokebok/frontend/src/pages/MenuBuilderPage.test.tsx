import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import MenuBuilderPage from './MenuBuilderPage'

const renderPage = () =>
  render(
    <MemoryRouter>
      <MenuBuilderPage />
    </MemoryRouter>
  )

describe('MenuBuilderPage', () => {
  it('renders heading', () => {
    renderPage()
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('loads and shows suggested menu', async () => {
    renderPage()
    await waitFor(() => {
      // titles appear in both dropdown options and MenuCards
      expect(screen.getAllByText('Laksesushi').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Pasta Carbonara').length).toBeGreaterThan(0)
    })
  })

  it('shows build menu button', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sett sammen meny/i })).toBeInTheDocument()
    })
  })

  it('shows total time after building menu', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sett sammen meny/i })).toBeInTheDocument()
    })
    await userEvent.click(screen.getByRole('button', { name: /sett sammen meny/i }))
    await waitFor(() => {
      expect(screen.getByText(/60 min/)).toBeInTheDocument()
    })
  })
})
