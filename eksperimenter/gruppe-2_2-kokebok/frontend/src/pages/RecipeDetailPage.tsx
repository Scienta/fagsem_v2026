import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { recipeApi } from '../api/recipes'
import IngredientList from '../components/IngredientList'
import StepList from '../components/StepList'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import type { Recipe } from '../types/Recipe'

export default function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    recipeApi.get(Number(id))
      .then(setRecipe)
      .catch(() => setError('Fant ikke oppskriften'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!recipe || !confirm('Slett denne oppskriften?')) return
    await recipeApi.remove(recipe.id)
    navigate('/')
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!recipe) return null

  const totalTime = (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0)

  return (
    <main className="recipe-detail">
      {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} className="recipe-detail__image" />}
      <div className="recipe-detail__header">
        <h1>{recipe.title}</h1>
        <div className="recipe-detail__badges">
          <span className="badge badge--category">{recipe.category}</span>
          {recipe.cuisine && <span className="badge badge--cuisine">{recipe.cuisine}</span>}
          {recipe.flavorTags.map(t => <span key={t} className="badge badge--flavor">{t}</span>)}
        </div>
        <div className="recipe-detail__meta">
          {recipe.servings && <span>{recipe.servings} porsjoner</span>}
          {recipe.prepTimeMinutes && <span>Forberedelse: {recipe.prepTimeMinutes} min</span>}
          {recipe.cookTimeMinutes && <span>Koking: {recipe.cookTimeMinutes} min</span>}
          {totalTime > 0 && <span>Totalt: {totalTime} min</span>}
        </div>
      </div>
      {recipe.description && <p className="recipe-detail__desc">{recipe.description}</p>}
      <section>
        <h2>Ingredienser</h2>
        <IngredientList ingredients={recipe.ingredients} />
      </section>
      <section>
        <h2>Fremgangsmåte</h2>
        <StepList steps={recipe.steps} />
      </section>
      <div className="recipe-detail__actions">
        <Link to={`/recipes/${recipe.id}/edit`} className="btn">Rediger</Link>
        <button className="btn btn--danger" onClick={handleDelete}>Slett</button>
        <Link to="/" className="btn btn--secondary">Tilbake</Link>
      </div>
    </main>
  )
}
