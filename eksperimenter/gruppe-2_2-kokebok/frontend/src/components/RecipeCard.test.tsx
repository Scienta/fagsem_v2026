import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import RecipeCard from './RecipeCard'
import { mockRecipe } from '../test/mocks/fixtures'

const renderCard = () =>
  render(
    <MemoryRouter>
      <RecipeCard recipe={mockRecipe} />
    </MemoryRouter>
  )

describe('RecipeCard', () => {
  it('renders the recipe title', () => {
    renderCard()
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
  })

  it('renders the cuisine', () => {
    renderCard()
    expect(screen.getByText('Italiensk')).toBeInTheDocument()
  })

  it('renders the category', () => {
    renderCard()
    expect(screen.getByText('HOVEDRETT')).toBeInTheDocument()
  })

  it('renders estimated time', () => {
    renderCard()
    expect(screen.getByText(/30 min/)).toBeInTheDocument()
  })

  it('links to the recipe detail page', () => {
    renderCard()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/recipes/1')
  })
})
