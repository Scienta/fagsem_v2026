import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMenu } from '../api/menus.js'
import MenuBuilder from '../components/menu/MenuBuilder.jsx'
import Button from '../components/ui/Button.jsx'

export default function MenuCreatePage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [courses, setCourses] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    try {
      const payload = {
        name,
        description,
        courses: courses
          .filter(c => c.recipeId)
          .map(c => ({ recipeId: c.recipeId, courseCategory: c.courseCategory, courseOrder: c.courseOrder })),
      }
      const menu = await createMenu(payload)
      navigate(`/menus/${menu.id}`)
    } catch (err) {
      setError(err.message)
      setIsSaving(false)
    }
  }

  const inputClass = 'w-full border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm'

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Ny meny</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Navn <span className="text-red-500">*</span></label>
          <input required className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="Eks. Italiensk kveld" />
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
          <Button type="button" variant="secondary" onClick={() => navigate('/menus')}>Avbryt</Button>
        </div>
      </form>
    </div>
  )
}
