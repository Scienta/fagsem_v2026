import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { recipeApi } from '../api/recipes'
import RecipeCard from '../components/RecipeCard'
import RecipeSearchBar from '../components/RecipeSearchBar'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import type { Recipe, SearchParams } from '../types/Recipe'

export default function RecipeListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [cuisines, setCuisines] = useState<string[]>([])
  const [params, setParams] = useState<SearchParams>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    recipeApi.categories().then(setCategories)
    recipeApi.cuisines().then(setCuisines)
  }, [])

  useEffect(() => {
    setLoading(true)
    const hasFilters = Object.values(params).some(v => v && (Array.isArray(v) ? v.length > 0 : true))
    const fetch = hasFilters ? recipeApi.search(params) : recipeApi.list()
    fetch
      .then(setRecipes)
      .catch(() => setError('Kunne ikke laste oppskrifter'))
      .finally(() => setLoading(false))
  }, [params])

  return (
    <main className="recipe-list-page">
      <div className="page-header">
        <h1>Oppskrifter</h1>
        <Link to="/recipes/new" className="btn btn--primary">Ny oppskrift</Link>
      </div>
      <RecipeSearchBar params={params} onChange={setParams} categories={categories} cuisines={cuisines} />
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      <div className="recipe-grid">
        {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
        {!loading && recipes.length === 0 && <p>Ingen oppskrifter funnet.</p>}
      </div>
    </main>
  )
}
