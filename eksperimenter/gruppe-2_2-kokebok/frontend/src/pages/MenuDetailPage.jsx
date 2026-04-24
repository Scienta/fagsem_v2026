import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useMenu } from '../hooks/useMenus.js'
import { deleteMenu } from '../api/menus.js'
import Badge, { categoryLabel } from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ConfirmModal from '../components/ui/ConfirmModal.jsx'

export default function MenuDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: menu, isLoading, error } = useMenu(id)
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleDelete() {
    await deleteMenu(id)
    navigate('/menus')
  }

  if (isLoading) return <Spinner />
  if (error) return <p className="text-red-600">Feil: {error}</p>
  if (!menu) return null

  const totalTime = menu.courses.reduce((sum, c) => {
    const r = c.recipe
    return sum + (r.prepTimeMinutes ?? 0) + (r.cookTimeMinutes ?? 0)
  }, 0)

  return (
    <div className="max-w-3xl mx-auto">
      {showConfirm && (
        <ConfirmModal
          title="Slett meny"
          message={`Slett "${menu.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <div className="flex items-start justify-between mb-6">
        <Link to="/menus" className="text-sm text-stone-500 hover:text-stone-700">← Tilbake</Link>
        <div className="flex gap-2">
          <Link to={`/menus/${id}/edit`}><Button variant="secondary">Rediger</Button></Link>
          <Button variant="danger" onClick={() => setShowConfirm(true)}>Slett</Button>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2">{menu.name}</h1>
      {menu.description && <p className="text-stone-600 mb-6">{menu.description}</p>}

      {totalTime > 0 && (
        <p className="text-sm text-stone-500 mb-8">Estimert total tid: <strong>{totalTime} min</strong></p>
      )}

      <div className="space-y-4">
        {menu.courses.map((course, i) => (
          <div key={course.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden flex">
            {course.recipe.thumbnailUrl && (
              <img src={course.recipe.thumbnailUrl} alt={course.recipe.title} className="w-28 h-28 object-cover shrink-0" />
            )}
            <div className="p-4 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-stone-400">{i + 1}.</span>
                <Badge type="category" value={course.courseCategory} />
              </div>
              <Link to={`/recipes/${course.recipe.id}`} className="font-bold text-lg hover:text-brand-600 transition-colors">
                {course.recipe.title}
              </Link>
              {course.recipe.description && (
                <p className="text-sm text-stone-500 mt-1 line-clamp-2">{course.recipe.description}</p>
              )}
              <div className="flex gap-3 mt-2 text-xs text-stone-400">
                {course.recipe.cuisine && <Badge type="cuisine" value={course.recipe.cuisine} />}
                {((course.recipe.prepTimeMinutes ?? 0) + (course.recipe.cookTimeMinutes ?? 0)) > 0 && (
                  <span>⏱ {(course.recipe.prepTimeMinutes ?? 0) + (course.recipe.cookTimeMinutes ?? 0)} min</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
