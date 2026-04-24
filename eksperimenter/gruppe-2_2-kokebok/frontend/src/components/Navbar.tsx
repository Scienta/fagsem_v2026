import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand">Kokebok</Link>
      <div className="navbar__links">
        <NavLink to="/" end>Oppskrifter</NavLink>
        <NavLink to="/recipes/new">Ny oppskrift</NavLink>
        <NavLink to="/menu">Menykart</NavLink>
      </div>
    </nav>
  )
}
