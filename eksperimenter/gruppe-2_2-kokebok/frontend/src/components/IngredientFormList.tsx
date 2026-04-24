import type { Ingredient } from '../types/Recipe'

interface Props {
  ingredients: Ingredient[]
  onChange: (ingredients: Ingredient[]) => void
}

export default function IngredientFormList({ ingredients, onChange }: Props) {
  const update = (index: number, field: keyof Ingredient, value: string | number | null) => {
    const updated = ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    )
    onChange(updated)
  }

  const add = () => {
    onChange([...ingredients, { sortOrder: ingredients.length, name: '', quantity: null, unit: '' }])
  }

  const remove = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index).map((ing, i) => ({ ...ing, sortOrder: i })))
  }

  return (
    <div className="ingredient-list">
      {ingredients.map((ing, i) => (
        <div key={i} className="ingredient-row">
          <input
            type="number"
            value={ing.quantity ?? ''}
            placeholder="Mengde"
            onChange={e => update(i, 'quantity', e.target.value ? Number(e.target.value) : null)}
          />
          <input
            type="text"
            value={ing.unit}
            placeholder="Enhet"
            onChange={e => update(i, 'unit', e.target.value)}
          />
          <input
            type="text"
            value={ing.name}
            placeholder="Ingrediens"
            onChange={e => update(i, 'name', e.target.value)}
          />
          <button type="button" onClick={() => remove(i)}>Fjern</button>
        </div>
      ))}
      <button type="button" onClick={add}>Legg til ingrediens</button>
    </div>
  )
}
