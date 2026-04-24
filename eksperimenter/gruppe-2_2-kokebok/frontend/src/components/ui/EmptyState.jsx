export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-5xl mb-4">🍽️</div>
      <h3 className="text-xl font-bold text-stone-700 mb-2">{title}</h3>
      {description && <p className="text-stone-500 mb-6">{description}</p>}
      {action}
    </div>
  )
}
