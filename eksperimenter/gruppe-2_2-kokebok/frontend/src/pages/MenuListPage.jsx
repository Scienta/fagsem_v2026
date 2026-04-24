import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMenus } from '../hooks/useMenus.js'
import { deleteMenu } from '../api/menus.js'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import ConfirmModal from '../components/ui/ConfirmModal.jsx'
import { categoryLabel } from '../components/ui/Badge.jsx'

export default function MenuListPage() {
  const { data: menus, isLoading, error } = useMenus()
  const navigate = useNavigate()
  const [confirmId, setConfirmId] = useState(null)

  async function handleDelete() {
    await deleteMenu(confirmId)
    setConfirmId(null)
    window.location.reload()
  }

  if (isLoading) return <Spinner />
  if (error) return <p className="text-red-600">Feil: {error}</p>

  return (
    <div className="space-y-6">
      {confirmId && (
        <ConfirmModal
          title="Slett meny"
          message="Er du sikker på at du vil slette denne menyen?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Menyer</h1>
        <Link to="/menus/new"><Button>+ Ny meny</Button></Link>
      </div>
      {menus.length === 0 ? (
        <EmptyState
          title="Ingen menyer ennå"
          description="Sett sammen en meny fra dine oppskrifter."
          action={<Link to="/menus/new"><Button>Lag meny</Button></Link>}
        />
      ) : (
        <div className="grid gap-4">
          {menus.map(menu => (
            <div key={menu.id} className="bg-white border border-stone-200 rounded-xl p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <Link to={`/menus/${menu.id}`} className="text-lg font-bold hover:text-brand-600 transition-colors">
                  {menu.name}
                </Link>
                {menu.description && <p className="text-stone-500 text-sm mt-1 line-clamp-1">{menu.description}</p>}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {menu.courses.map(c => (
                    <span key={c.id} className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                      {categoryLabel(c.courseCategory)}: {c.recipe.title}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to={`/menus/${menu.id}/edit`}><Button variant="secondary" className="py-1.5 text-xs">Rediger</Button></Link>
                <Button variant="danger" className="py-1.5 text-xs" onClick={() => setConfirmId(menu.id)}>Slett</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
