import { useEffect, useState } from 'react'
import { menuApi } from '../api/menu'
import { recipeApi } from '../api/recipes'
import MenuCard from '../components/MenuCard'
import LoadingSpinner from '../components/LoadingSpinner'
import type { Recipe } from '../types/Recipe'

export default function MenuBuilderPage() {
  const [categories, setCategories] = useState<string[]>([])
  const [selections, setSelections] = useState<Record<string, number>>({})
  const [recipesByCategory, setRecipesByCategory] = useState<Record<string, Recipe[]>>({})
  const [menuDishes, setMenuDishes] = useState<Recipe[]>([])
  const [totalTime, setTotalTime] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const cats = await recipeApi.categories()
      setCategories(cats)
      const byCategory: Record<string, Recipe[]> = {}
      await Promise.all(cats.map(async cat => {
        const recipes = await recipeApi.search({ category: cat })
        byCategory[cat] = recipes
      }))
      setRecipesByCategory(byCategory)

      const suggested = await menuApi.suggest()
      const initial: Record<string, number> = {}
      const dishes: Recipe[] = []
      for (const [cat, recipe] of Object.entries(suggested)) {
        initial[cat] = recipe.id
        dishes.push(recipe)
      }
      setSelections(initial)
      setMenuDishes(dishes)
      setLoading(false)
    }
    init()
  }, [])

  const handleBuild = async () => {
    const result = await menuApi.build(selections)
    setMenuDishes(result.dishes)
    setTotalTime(result.totalTimeMinutes)
  }

  return (
    <main className="menu-builder">
      <h1>Sett sammen en meny</h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="menu-builder__selectors">
            {categories.map(cat => {
              const options = recipesByCategory[cat] ?? []
              if (options.length === 0) return null
              return (
                <div key={cat} className="menu-builder__row">
                  <label>{cat}</label>
                  <select
                    value={selections[cat] ?? ''}
                    onChange={e => setSelections(s => ({ ...s, [cat]: Number(e.target.value) }))}
                  >
                    <option value="">Velg rett</option>
                    {options.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                  </select>
                </div>
              )
            })}
          </div>
          <button className="btn btn--primary" onClick={handleBuild}>Sett sammen meny</button>
          {menuDishes.length > 0 && (
            <section className="menu-result">
              <h2>Din meny</h2>
              <div className="menu-cards">
                {menuDishes.map(r => <MenuCard key={r.id} recipe={r} />)}
              </div>
              {totalTime !== null && <p className="menu-total-time">Estimert tid: {totalTime} min</p>}
            </section>
          )}
        </>
      )}
    </main>
  )
}
