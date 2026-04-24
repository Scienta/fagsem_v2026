import { Link } from 'react-router-dom'
import type { Recipe } from '../types/Recipe'

interface Props {
  recipe: Recipe
}

export default function MenuCard({ recipe }: Props) {
  const totalTime = (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0)
  return (
    <div className="menu-card">
      {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} />}
      <div className="menu-card__body">
        <span className="badge badge--category">{recipe.category}</span>
        <h3><Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link></h3>
        {recipe.cuisine && <p>{recipe.cuisine}</p>}
        {totalTime > 0 && <p>{totalTime} min</p>}
      </div>
    </div>
  )
}
