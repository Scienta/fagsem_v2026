import type { RecipeCategory } from '../types/Recipe'

const CATEGORIES: RecipeCategory[] = ['FORRETT', 'HOVEDRETT', 'DESSERT', 'SNACK', 'DRIKKE']

interface Props {
  value: RecipeCategory | ''
  onChange: (value: RecipeCategory) => void
  required?: boolean
}

export default function CategorySelector({ value, onChange, required }: Props) {
  return (
    <select
      aria-label="Kategori"
      value={value}
      onChange={e => onChange(e.target.value as RecipeCategory)}
      required={required}
    >
      <option value="">Velg kategori</option>
      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
  )
}
