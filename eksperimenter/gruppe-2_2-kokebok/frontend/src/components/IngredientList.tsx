import type { Ingredient } from '../types/Recipe'

interface Props {
  ingredients: Ingredient[]
}

export default function IngredientList({ ingredients }: Props) {
  if (ingredients.length === 0) return null
  return (
    <ul className="ingredient-list">
      {ingredients.map((ing, i) => (
        <li key={i}>
          {ing.quantity && <span>{ing.quantity} {ing.unit} </span>}
          <span>{ing.name}</span>
        </li>
      ))}
    </ul>
  )
}
