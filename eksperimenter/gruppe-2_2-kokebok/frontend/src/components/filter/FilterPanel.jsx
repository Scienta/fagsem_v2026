import { categoryLabel, cuisineLabel, flavorLabel } from '../ui/Badge.jsx'

function CheckGroup({ title, options, selected, onChange, labelFn }) {
  return (
    <div>
      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const active = selected === opt || (Array.isArray(selected) && selected.includes(opt))
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
                ${active
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-brand-400'}`}
            >
              {labelFn(opt)}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function FilterPanel({ filters, onChange, categories, cuisines, flavors }) {
  function toggle(key, value) {
    if (key === 'category' || key === 'cuisine') {
      onChange({ ...filters, [key]: filters[key] === value ? '' : value })
    } else if (key === 'flavor') {
      const current = filters.flavor ?? []
      const next = current.includes(value) ? current.filter(f => f !== value) : [...current, value]
      onChange({ ...filters, flavor: next })
    }
  }

  return (
    <aside className="space-y-5">
      <CheckGroup
        title="Kategori"
        options={categories}
        selected={filters.category}
        onChange={v => toggle('category', v)}
        labelFn={categoryLabel}
      />
      <CheckGroup
        title="Kjøkken"
        options={cuisines}
        selected={filters.cuisine}
        onChange={v => toggle('cuisine', v)}
        labelFn={cuisineLabel}
      />
      <CheckGroup
        title="Smak"
        options={flavors}
        selected={filters.flavor ?? []}
        onChange={v => toggle('flavor', v)}
        labelFn={flavorLabel}
      />
    </aside>
  )
}
