import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { recipeApi } from '../api/recipes'
import IngredientFormList from '../components/IngredientFormList'
import StepFormList from '../components/StepFormList'
import FlavorTagSelector from '../components/FlavorTagSelector'
import CategorySelector from '../components/CategorySelector'
import ImageUpload from '../components/ImageUpload'
import ErrorMessage from '../components/ErrorMessage'
import type { FlavorTag, Ingredient, RecipeCategory, RecipeInput, RecipeStep } from '../types/Recipe'

const emptyForm = (): RecipeInput => ({
  title: '',
  description: '',
  cuisine: '',
  category: '' as RecipeCategory,
  flavorTags: [],
  prepTimeMinutes: null,
  cookTimeMinutes: null,
  servings: null,
  imageFilename: null,
  ingredients: [],
  steps: [],
})

export default function RecipeFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<RecipeInput>(emptyForm())
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit || !id) return
    recipeApi.get(Number(id)).then(recipe => {
      setForm({
        title: recipe.title,
        description: recipe.description,
        cuisine: recipe.cuisine,
        category: recipe.category,
        flavorTags: recipe.flavorTags,
        prepTimeMinutes: recipe.prepTimeMinutes,
        cookTimeMinutes: recipe.cookTimeMinutes,
        servings: recipe.servings,
        imageFilename: recipe.imageFilename,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
      })
    })
  }, [id, isEdit])

  const set = <K extends keyof RecipeInput>(key: K, value: RecipeInput[K]) => {
    setForm(f => ({ ...f, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Tittel er påkrevd'); return }
    if (!form.category) { setError('Kategori er påkrevd'); return }
    setError('')
    try {
      const saved = isEdit
        ? await recipeApi.update(Number(id), form)
        : await recipeApi.create(form)
      navigate(`/recipes/${saved.id}`)
    } catch {
      setError('Kunne ikke lagre oppskriften')
    }
  }

  const imageUrl = form.imageFilename ? `/images/${form.imageFilename}` : null

  return (
    <main className="recipe-form-page">
      <h1>{isEdit ? 'Rediger oppskrift' : 'Ny oppskrift'}</h1>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-group">
          <label htmlFor="title">Tittel</label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Kategori</label>
          <CategorySelector
            value={form.category}
            onChange={v => set('category', v)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cuisine">Kjøkken</label>
          <input
            id="cuisine"
            type="text"
            value={form.cuisine ?? ''}
            onChange={e => set('cuisine', e.target.value)}
            placeholder="f.eks. Italiensk, Norsk, Kinesisk"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Beskrivelse</label>
          <textarea
            id="description"
            value={form.description ?? ''}
            onChange={e => set('description', e.target.value)}
            rows={3}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prep">Forberedelse (min)</label>
            <input
              id="prep"
              type="number"
              value={form.prepTimeMinutes ?? ''}
              onChange={e => set('prepTimeMinutes', e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cook">Koking (min)</label>
            <input
              id="cook"
              type="number"
              value={form.cookTimeMinutes ?? ''}
              onChange={e => set('cookTimeMinutes', e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="servings">Porsjoner</label>
            <input
              id="servings"
              type="number"
              value={form.servings ?? ''}
              onChange={e => set('servings', e.target.value ? Number(e.target.value) : null)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Smaker</label>
          <FlavorTagSelector
            selected={form.flavorTags as FlavorTag[]}
            onChange={tags => set('flavorTags', tags)}
          />
        </div>
        <div className="form-group">
          <label>Bilde</label>
          <ImageUpload
            currentImageUrl={imageUrl}
            onUploaded={filename => set('imageFilename', filename)}
          />
        </div>
        <div className="form-group">
          <label>Ingredienser</label>
          <IngredientFormList
            ingredients={form.ingredients as Ingredient[]}
            onChange={ings => set('ingredients', ings)}
          />
        </div>
        <div className="form-group">
          <label>Fremgangsmåte</label>
          <StepFormList
            steps={form.steps as RecipeStep[]}
            onChange={steps => set('steps', steps)}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn--primary">Lagre</button>
          <button type="button" className="btn btn--secondary" onClick={() => navigate(-1)}>Avbryt</button>
        </div>
      </form>
    </main>
  )
}
