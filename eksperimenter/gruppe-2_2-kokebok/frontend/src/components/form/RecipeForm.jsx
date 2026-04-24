import { useState } from 'react'
import Button from '../ui/Button.jsx'
import { categoryLabel, cuisineLabel, flavorLabel } from '../ui/Badge.jsx'
import { useMeta } from '../../hooks/useMeta.js'

function FieldRow({ label, children, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass = 'w-full border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm'

function IngredientFields({ ingredients, onChange }) {
  function update(i, field, value) {
    const next = ingredients.map((ing, idx) => idx === i ? { ...ing, [field]: value } : ing)
    onChange(next)
  }
  function add() { onChange([...ingredients, { name: '', amount: '', unit: '', sortOrder: ingredients.length }]) }
  function remove(i) { onChange(ingredients.filter((_, idx) => idx !== i).map((ing, idx) => ({ ...ing, sortOrder: idx }))) }

  return (
    <div className="space-y-2">
      {ingredients.map((ing, i) => (
        <div key={i} className="flex gap-2 items-center min-w-0">
          <input className="flex-1 min-w-0 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm" placeholder="Ingrediens" value={ing.name} onChange={e => update(i, 'name', e.target.value)} />
          <input className="w-24 shrink-0 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm" placeholder="Mengde" type="number" step="any" value={ing.amount} onChange={e => update(i, 'amount', e.target.value)} />
          <input className="w-20 shrink-0 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm" placeholder="Enhet" value={ing.unit} onChange={e => update(i, 'unit', e.target.value)} />
          <button type="button" onClick={() => remove(i)} className="text-stone-400 hover:text-red-500 text-lg px-1 shrink-0">×</button>
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={add} className="text-xs py-1.5">+ Legg til ingrediens</Button>
    </div>
  )
}

function StepFields({ steps, onChange }) {
  function update(i, value) {
    const next = steps.map((s, idx) => idx === i ? { ...s, description: value } : s)
    onChange(next)
  }
  function add() { onChange([...steps, { stepNumber: steps.length + 1, description: '' }]) }
  function remove(i) {
    onChange(steps.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, stepNumber: idx + 1 })))
  }

  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-2 items-start">
          <span className="mt-2 text-sm font-bold text-stone-400 w-6 shrink-0">{step.stepNumber}.</span>
          <textarea
            className={`${inputClass} flex-1 min-h-[72px] resize-none`}
            placeholder={`Trinn ${step.stepNumber}`}
            value={step.description}
            onChange={e => update(i, e.target.value)}
          />
          <button type="button" onClick={() => remove(i)} className="text-stone-400 hover:text-red-500 text-lg mt-2 px-1">×</button>
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={add} className="text-xs py-1.5">+ Legg til trinn</Button>
    </div>
  )
}

function MultiToggle({ options, selected, onChange, labelFn }) {
  function toggle(v) {
    const next = selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]
    onChange(next)
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
            ${selected.includes(opt) ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-stone-600 border-stone-200 hover:border-brand-400'}`}
        >
          {labelFn(opt)}
        </button>
      ))}
    </div>
  )
}

const EMPTY_FORM = {
  title: '',
  description: '',
  prepTimeMinutes: '',
  cookTimeMinutes: '',
  category: '',
  cuisine: '',
  flavorTags: [],
  ingredients: [],
  steps: [],
}

export default function RecipeForm({ initial, onSave, onCancel, isSaving }) {
  const { categories, cuisines, flavors } = useMeta()
  const [form, setForm] = useState(() => initial ? {
    ...EMPTY_FORM,
    ...initial,
    prepTimeMinutes: initial.prepTimeMinutes ?? '',
    cookTimeMinutes: initial.cookTimeMinutes ?? '',
    flavorTags: initial.flavorTags ?? [],
    ingredients: initial.ingredients ?? [],
    steps: initial.steps ?? [],
  } : EMPTY_FORM)

  function set(field, value) { setForm(f => ({ ...f, [field]: value })) }

  function handleSubmit(e) {
    e.preventDefault()
    onSave({
      ...form,
      prepTimeMinutes: form.prepTimeMinutes !== '' ? Number(form.prepTimeMinutes) : null,
      cookTimeMinutes: form.cookTimeMinutes !== '' ? Number(form.cookTimeMinutes) : null,
      category: form.category || null,
      cuisine: form.cuisine || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FieldRow label="Tittel" required>
        <input className={inputClass} required value={form.title} onChange={e => set('title', e.target.value)} placeholder="Oppskriftens navn" />
      </FieldRow>

      <FieldRow label="Beskrivelse">
        <textarea className={`${inputClass} min-h-[80px] resize-none`} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Kort beskrivelse av retten" />
      </FieldRow>

      <div className="grid grid-cols-2 gap-4">
        <FieldRow label="Forberedelsestid (min)">
          <input className={inputClass} type="number" min="0" value={form.prepTimeMinutes} onChange={e => set('prepTimeMinutes', e.target.value)} placeholder="0" />
        </FieldRow>
        <FieldRow label="Koketid (min)">
          <input className={inputClass} type="number" min="0" value={form.cookTimeMinutes} onChange={e => set('cookTimeMinutes', e.target.value)} placeholder="0" />
        </FieldRow>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldRow label="Kategori">
          <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value)}>
            <option value="">Velg kategori</option>
            {categories.map(c => <option key={c} value={c}>{categoryLabel(c)}</option>)}
          </select>
        </FieldRow>
        <FieldRow label="Kjøkken">
          <select className={inputClass} value={form.cuisine} onChange={e => set('cuisine', e.target.value)}>
            <option value="">Velg kjøkken</option>
            {cuisines.map(c => <option key={c} value={c}>{cuisineLabel(c)}</option>)}
          </select>
        </FieldRow>
      </div>

      <FieldRow label="Smaker">
        <MultiToggle options={flavors} selected={form.flavorTags} onChange={v => set('flavorTags', v)} labelFn={flavorLabel} />
      </FieldRow>

      <FieldRow label="Ingredienser">
        <IngredientFields ingredients={form.ingredients} onChange={v => set('ingredients', v)} />
      </FieldRow>

      <FieldRow label="Fremgangsmåte">
        <StepFields steps={form.steps} onChange={v => set('steps', v)} />
      </FieldRow>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSaving}>{isSaving ? 'Lagrer...' : 'Lagre oppskrift'}</Button>
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Avbryt</Button>}
      </div>
    </form>
  )
}
