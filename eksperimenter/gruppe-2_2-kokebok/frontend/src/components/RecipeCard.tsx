import { Link } from 'react-router-dom'
import type { Recipe } from '../types/Recipe'

interface Props {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: Props) {
  const totalTime = (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0)

  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card">
      {recipe.imageUrl ? (
        <img src={recipe.imageUrl} alt={recipe.title} className="recipe-card__image" />
      ) : (
        <div className="recipe-card__image-placeholder" />
      )}
      <div className="recipe-card__body">
        <h3 className="recipe-card__title">{recipe.title}</h3>
        <div className="recipe-card__meta">
          <span className="badge badge--category">{recipe.category}</span>
          {recipe.cuisine && <span className="badge badge--cuisine">{recipe.cuisine}</span>}
        </div>
        {totalTime > 0 && <p className="recipe-card__time">{totalTime} min</p>}
      </div>
    </Link>
  )
}
