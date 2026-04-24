import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRecipe } from '../api/recipes.js'
import RecipeForm from '../components/form/RecipeForm.jsx'

export default function RecipeCreatePage() {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSave(data) {
    setIsSaving(true)
    setError(null)
    try {
      const recipe = await createRecipe(data)
      navigate(`/recipes/${recipe.id}`)
    } catch (err) {
      setError(err.message)
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Ny oppskrift</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <RecipeForm onSave={handleSave} onCancel={() => navigate('/recipes')} isSaving={isSaving} />
    </div>
  )
}
