import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { updateRecipe } from '../api/recipes.js'
import { useRecipe } from '../hooks/useRecipe.js'
import RecipeForm from '../components/form/RecipeForm.jsx'
import Spinner from '../components/ui/Spinner.jsx'

export default function RecipeEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: recipe, isLoading, error } = useRecipe(id)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  async function handleSave(data) {
    setIsSaving(true)
    setSaveError(null)
    try {
      await updateRecipe(id, data)
      navigate(`/recipes/${id}`)
    } catch (err) {
      setSaveError(err.message)
      setIsSaving(false)
    }
  }

  if (isLoading) return <Spinner />
  if (error) return <p className="text-red-600">Feil: {error}</p>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Rediger oppskrift</h1>
      {saveError && <p className="text-red-600 mb-4">{saveError}</p>}
      <RecipeForm initial={recipe} onSave={handleSave} onCancel={() => navigate(`/recipes/${id}`)} isSaving={isSaving} />
    </div>
  )
}
