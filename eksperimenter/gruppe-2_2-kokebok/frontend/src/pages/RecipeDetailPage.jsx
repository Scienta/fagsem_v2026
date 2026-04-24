import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useRecipe } from '../hooks/useRecipe.js'
import { deleteRecipe } from '../api/recipes.js'
import ImageUpload from '../components/form/ImageUpload.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ConfirmModal from '../components/ui/ConfirmModal.jsx'

export default function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: recipe, isLoading, error, setData } = useRecipe(id)
  const [showConfirm, setShowConfirm] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  async function handleDelete() {
    await deleteRecipe(id)
    navigate('/recipes')
  }

  if (isLoading) return <Spinner />
  if (error) return <p className="text-red-600">Feil: {error}</p>
  if (!recipe) return null

  const totalTime = (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0)

  return (
    <div className="max-w-4xl mx-auto">
      {showConfirm && (
        <ConfirmModal
          title="Slett oppskrift"
          message={`Er du sikker på at du vil slette "${recipe.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="flex items-start justify-between mb-6">
        <Link to="/recipes" className="text-sm text-stone-500 hover:text-stone-700">← Tilbake</Link>
        <div className="flex gap-2">
          <Link to={`/recipes/${id}/edit`}><Button variant="secondary">Rediger</Button></Link>
          <Button variant="danger" onClick={() => setShowConfirm(true)}>Slett</Button>
        </div>
      </div>

      {recipe.images && recipe.images.length > 0 && (
        <div className="mb-6">
          <div className="aspect-video rounded-2xl overflow-hidden bg-stone-100 mb-2">
            <img src={recipe.images[activeImage]?.url} alt={recipe.title} className="w-full h-full object-cover" />
          </div>
          {recipe.images.length > 1 && (
            <div className="flex gap-2">
              {recipe.images.map((img, i) => (
                <button key={img.id} onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-brand-500' : 'border-transparent'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-3">{recipe.title}</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {recipe.category && <Badge type="category" value={recipe.category} />}
        {recipe.cuisine && <Badge type="cuisine" value={recipe.cuisine} />}
        {recipe.flavorTags?.map(f => <Badge key={f} type="flavor" value={f} />)}
      </div>

      {recipe.description && (
        <p className="text-stone-600 text-lg mb-6">{recipe.description}</p>
      )}

      <div className="grid grid-cols-3 gap-4 bg-stone-50 rounded-xl p-4 mb-8 text-center">
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-wide">Forb.tid</p>
          <p className="font-bold text-stone-800">{recipe.prepTimeMinutes ?? '-'} min</p>
        </div>
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-wide">Koketid</p>
          <p className="font-bold text-stone-800">{recipe.cookTimeMinutes ?? '-'} min</p>
        </div>
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-wide">Totalt</p>
          <p className="font-bold text-stone-800">{totalTime || '-'} min</p>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Ingredienser</h2>
          <ul className="space-y-2">
            {recipe.ingredients?.map(ing => (
              <li key={ing.id} className="flex justify-between text-sm border-b border-stone-100 pb-2">
                <span className="text-stone-700">{ing.name}</span>
                <span className="text-stone-500 font-medium">
                  {ing.amount != null ? `${ing.amount} ${ing.unit ?? ''}`.trim() : ing.unit ?? ''}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-xl font-bold mb-4">Fremgangsmåte</h2>
          <ol className="space-y-4">
            {recipe.steps?.map(step => (
              <li key={step.id} className="flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-brand-500 text-white text-sm font-bold flex items-center justify-center">
                  {step.stepNumber}
                </span>
                <p className="text-stone-700 pt-1">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-stone-200">
        <h2 className="text-xl font-bold mb-4">Bilder</h2>
        <ImageUpload
          recipeId={Number(id)}
          images={recipe.images ?? []}
          onImagesChange={images => setData({ ...recipe, images })}
        />
      </div>
    </div>
  )
}
