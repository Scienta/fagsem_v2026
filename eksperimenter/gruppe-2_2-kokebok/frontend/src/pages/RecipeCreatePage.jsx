import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRecipe } from '../api/recipes.js'
import RecipeForm from '../components/form/RecipeForm.jsx'
import ImageUpload from '../components/form/ImageUpload.jsx'
import Button from '../components/ui/Button.jsx'

export default function RecipeCreatePage() {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [savedRecipe, setSavedRecipe] = useState(null)

  async function handleSave(data) {
    setIsSaving(true)
    setError(null)
    try {
      const recipe = await createRecipe(data)
      setSavedRecipe(recipe)
    } catch (err) {
      setError(err.message)
      setIsSaving(false)
    }
  }

  if (savedRecipe) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">✓</div>
          <h1 className="text-2xl font-bold">Oppskrift lagret!</h1>
        </div>

        <div className="bg-stone-50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-1">{savedRecipe.title}</h2>
          <p className="text-stone-500 text-sm mb-4">Legg til bilder for oppskriften (valgfritt).</p>
          <ImageUpload
            recipeId={savedRecipe.id}
            images={savedRecipe.images ?? []}
            onImagesChange={images => setSavedRecipe(r => ({ ...r, images }))}
          />
        </div>

        <Button onClick={() => navigate(`/recipes/${savedRecipe.id}`)}>
          Gå til oppskrift →
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Ny oppskrift</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <RecipeForm onSave={handleSave} onCancel={() => navigate('/recipes')} isSaving={isSaving} />
    </div>
  )
}
