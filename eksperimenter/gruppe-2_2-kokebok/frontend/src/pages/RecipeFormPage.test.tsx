import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import RecipeFormPage from './RecipeFormPage'

const renderCreate = () =>
  render(
    <MemoryRouter initialEntries={['/recipes/new']}>
      <Routes>
        <Route path="/recipes/new" element={<RecipeFormPage />} />
        <Route path="/recipes/:id" element={<div>Detail page</div>} />
      </Routes>
    </MemoryRouter>
  )

const renderEdit = () =>
  render(
    <MemoryRouter initialEntries={['/recipes/1/edit']}>
      <Routes>
        <Route path="/recipes/:id/edit" element={<RecipeFormPage />} />
        <Route path="/recipes/:id" element={<div>Detail page</div>} />
      </Routes>
    </MemoryRouter>
  )

describe('RecipeFormPage - create mode', () => {
  it('renders a form with title input', () => {
    renderCreate()
    expect(screen.getByLabelText(/tittel/i)).toBeInTheDocument()
  })

  it('renders category selector', () => {
    renderCreate()
    expect(screen.getByRole('combobox', { name: /kategori/i })).toBeInTheDocument()
  })

  it('renders submit button', () => {
    renderCreate()
    expect(screen.getByRole('button', { name: /lagre/i })).toBeInTheDocument()
  })
})

describe('RecipeFormPage - edit mode', () => {
  it('pre-fills title from existing recipe', async () => {
    renderEdit()
    await waitFor(() => {
      expect(screen.getByDisplayValue('Pasta Carbonara')).toBeInTheDocument()
    })
  })

  it('pre-fills ingredients from existing recipe', async () => {
    renderEdit()
    await waitFor(() => {
      expect(screen.getByDisplayValue('Spaghetti')).toBeInTheDocument()
    })
  })
})

describe('RecipeFormPage - submission', () => {
  it('navigates to detail page after successful create', async () => {
    renderCreate()
    fireEvent.change(screen.getByLabelText(/tittel/i), { target: { value: 'Min rett' } })
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /kategori/i }), 'HOVEDRETT')
    await userEvent.click(screen.getByRole('button', { name: /lagre/i }))
    await waitFor(() => {
      expect(screen.getByText('Detail page')).toBeInTheDocument()
    })
  })
})
