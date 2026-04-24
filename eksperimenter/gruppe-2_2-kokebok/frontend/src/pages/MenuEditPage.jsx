import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { updateMenu } from '../api/menus.js'
import { useMenu } from '../hooks/useMenus.js'
import MenuBuilder from '../components/menu/MenuBuilder.jsx'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'

export default function MenuEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: menu, isLoading, error } = useMenu(id)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [courses, setCourses] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    if (!menu) return
    setName(menu.name)
    setDescription(menu.description ?? '')
    setCourses(menu.courses.map(c => ({
      recipeId: c.recipe.id,
      courseCategory: c.courseCategory,
      courseOrder: c.courseOrder,
    })))
  }, [menu])

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSaving(true)
    setSaveError(null)
    try {
      const payload = {
        name,
        description,
        courses: courses
          .filter(c => c.recipeId)
          .map(c => ({ recipeId: c.recipeId, courseCategory: c.courseCategory, courseOrder: c.courseOrder })),
      }
      await updateMenu(id, payload)
      navigate(`/menus/${id}`)
    } catch (err) {
      setSaveError(err.message)
      setIsSaving(false)
    }
  }

  if (isLoading) return <Spinner />
  if (error) return <p className="text-red-600">Feil: {error}</p>

  const inputClass = 'w-full border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm'

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Rediger meny</h1>
      {saveError && <p className="text-red-600 mb-4">{saveError}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Navn <span className="text-red-500">*</span></label>
          <input required className={inputClass} value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Beskrivelse</label>
          <textarea className={`${inputClass} min-h-[60px] resize-none`} value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">Retter</label>
          <MenuBuilder value={courses} onChange={setCourses} />
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={isSaving}>{isSaving ? 'Lagrer...' : 'Lagre meny'}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(`/menus/${id}`)}>Avbryt</Button>
        </div>
      </form>
    </div>
  )
}
