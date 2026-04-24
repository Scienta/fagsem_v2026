import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <h1>404 – Siden finnes ikke</h1>
      <Link to="/">Tilbake til forsiden</Link>
    </main>
  )
}
