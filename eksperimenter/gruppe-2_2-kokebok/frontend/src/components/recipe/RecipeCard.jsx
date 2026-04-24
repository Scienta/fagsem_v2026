import { Link } from 'react-router-dom'
import Badge, { categoryLabel, cuisineLabel } from '../ui/Badge.jsx'

export default function RecipeCard({ recipe }) {
  const totalTime = (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0)

  return (
    <Link to={`/recipes/${recipe.id}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100">
      <div className="aspect-video bg-stone-100 overflow-hidden">
        {recipe.thumbnailUrl ? (
          <img
            src={recipe.thumbnailUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-stone-300">🍽️</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex gap-2 mb-2 flex-wrap">
          {recipe.category && <Badge type="category" value={recipe.category} />}
          {recipe.cuisine && <Badge type="cuisine" value={recipe.cuisine} />}
        </div>
        <h3 className="font-bold text-stone-900 group-hover:text-brand-600 transition-colors line-clamp-2 mb-1">
          {recipe.title}
        </h3>
        {recipe.description && (
          <p className="text-sm text-stone-500 line-clamp-2 mb-3">{recipe.description}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-stone-400">
          {totalTime > 0 && (
            <span>⏱ {totalTime} min</span>
          )}
          {recipe.flavorTags && recipe.flavorTags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {recipe.flavorTags.slice(0, 2).map(f => (
                <Badge key={f} type="flavor" value={f} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
