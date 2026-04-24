import { Link } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes.js'
import RecipeGrid from '../components/recipe/RecipeGrid.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Button from '../components/ui/Button.jsx'

export default function HomePage() {
  const { data, isLoading } = useRecipes({ size: 6 })
  const recipes = data?.content ?? []

  return (
    <div className="space-y-10">
      <section className="text-center py-12 bg-gradient-to-br from-brand-50 to-amber-50 rounded-2xl">
        <h1 className="text-4xl font-bold text-stone-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
          Velkommen til Kokebok
        </h1>
        <p className="text-stone-600 text-lg mb-6 max-w-md mx-auto">
          Din digitale kokebok for å lagre, organisere og finne oppskrifter.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/recipes/new">
            <Button>Legg til oppskrift</Button>
          </Link>
          <Link to="/recipes">
            <Button variant="secondary">Se alle oppskrifter</Button>
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-stone-900">Siste oppskrifter</h2>
          <Link to="/recipes" className="text-sm text-brand-600 hover:underline">Se alle →</Link>
        </div>
        {isLoading ? <Spinner /> : recipes.length === 0 ? (
          <p className="text-stone-500 text-center py-8">Ingen oppskrifter ennå. Legg til den første!</p>
        ) : (
          <RecipeGrid recipes={recipes} />
        )}
      </section>
    </div>
  )
}
