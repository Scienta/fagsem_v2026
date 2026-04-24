import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

export default function AppShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-stone-200 text-center text-sm text-stone-400 py-4">
        Kokebok &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
}
