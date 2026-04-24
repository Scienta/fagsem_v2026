import { useState } from 'react'
import { useRecipes } from '../hooks/useRecipes.js'
import { useMeta } from '../hooks/useMeta.js'
import { useDebounce } from '../hooks/useDebounce.js'
import RecipeGrid from '../components/recipe/RecipeGrid.jsx'
import SearchBar from '../components/filter/SearchBar.jsx'
import FilterPanel from '../components/filter/FilterPanel.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Button from '../components/ui/Button.jsx'
import { Link } from 'react-router-dom'

export default function RecipeListPage() {
  const { categories, cuisines, flavors } = useMeta()
  const [searchText, setSearchText] = useState('')
  const [filters, setFilters] = useState({ category: '', cuisine: '', flavor: [], ingredient: '' })
  const debouncedSearch = useDebounce(searchText)

  const params = {
    q: debouncedSearch || undefined,
    category: filters.category || undefined,
    cuisine: filters.cuisine || undefined,
    flavor: filters.flavor.length ? filters.flavor : undefined,
    ingredient: filters.ingredient || undefined,
    size: 24,
  }

  const { data, isLoading, error } = useRecipes(params)
  const recipes = data?.content ?? []

  function clearFilters() {
    setSearchText('')
    setFilters({ category: '', cuisine: '', flavor: [], ingredient: '' })
  }

  const hasFilters = searchText || filters.category || filters.cuisine || filters.flavor.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Oppskrifter</h1>
        <Link to="/recipes/new"><Button>+ Ny oppskrift</Button></Link>
      </div>

      <SearchBar value={searchText} onChange={setSearchText} />

      <div className="flex gap-8">
        <aside className="hidden md:block w-48 shrink-0">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            categories={categories}
            cuisines={cuisines}
            flavors={flavors}
          />
          {hasFilters && (
            <button onClick={clearFilters} className="mt-4 text-xs text-stone-400 hover:text-stone-600 underline">
              Nullstill filter
            </button>
          )}
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <Spinner />
          ) : error ? (
            <p className="text-red-600">Feil: {error}</p>
          ) : recipes.length === 0 ? (
            <EmptyState
              title="Ingen oppskrifter funnet"
              description={hasFilters ? 'Prøv å justere søket eller filtrene.' : 'Legg til din første oppskrift!'}
              action={!hasFilters && <Link to="/recipes/new"><Button>Legg til oppskrift</Button></Link>}
            />
          ) : (
            <>
              <p className="text-sm text-stone-500 mb-4">{data.totalElements} oppskrift{data.totalElements !== 1 ? 'er' : ''}</p>
              <RecipeGrid recipes={recipes} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
