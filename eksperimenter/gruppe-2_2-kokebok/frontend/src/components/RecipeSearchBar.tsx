import type { SearchParams } from '../types/Recipe'

interface Props {
  params: SearchParams
  onChange: (params: SearchParams) => void
  categories: string[]
  cuisines: string[]
}

export default function RecipeSearchBar({ params, onChange, categories, cuisines }: Props) {
  const set = (key: keyof SearchParams, value: string) => {
    onChange({ ...params, [key]: value || undefined })
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Søk på tittel eller beskrivelse"
        value={params.q ?? ''}
        onChange={e => set('q', e.target.value)}
      />
      <label htmlFor="category-select">Kategori</label>
      <select
        id="category-select"
        aria-label="Kategori"
        value={params.category ?? ''}
        onChange={e => set('category', e.target.value)}
      >
        <option value="">Alle kategorier</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <label htmlFor="cuisine-select">Kjøkken</label>
      <select
        id="cuisine-select"
        aria-label="Kjøkken"
        value={params.cuisine ?? ''}
        onChange={e => set('cuisine', e.target.value)}
      >
        <option value="">Alle kjøkken</option>
        {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input
        type="text"
        placeholder="Ingrediens"
        value={params.ingredient ?? ''}
        onChange={e => set('ingredient', e.target.value)}
      />
    </div>
  )
}
