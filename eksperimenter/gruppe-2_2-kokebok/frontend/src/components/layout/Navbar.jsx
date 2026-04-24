import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-stone-600 hover:text-stone-900'}`

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-brand-600" style={{ fontFamily: 'Playfair Display, serif' }}>
          Kokebok
        </Link>
        <nav className="flex gap-6">
          <NavLink to="/recipes" className={linkClass}>Oppskrifter</NavLink>
          <NavLink to="/menus" className={linkClass}>Menyer</NavLink>
        </nav>
        <Link
          to="/recipes/new"
          className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Ny oppskrift
        </Link>
      </div>
    </header>
  )
}
