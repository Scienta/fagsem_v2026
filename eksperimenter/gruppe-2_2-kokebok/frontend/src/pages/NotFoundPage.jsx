import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'

export default function NotFoundPage() {
  return (
    <div className="text-center py-24">
      <div className="text-6xl mb-4">🍳</div>
      <h1 className="text-4xl font-bold mb-3">404</h1>
      <p className="text-stone-500 mb-6">Siden ble ikke funnet.</p>
      <Link to="/"><Button>Tilbake til forsiden</Button></Link>
    </div>
  )
}
