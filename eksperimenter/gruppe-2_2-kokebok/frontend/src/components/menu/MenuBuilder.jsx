import { useState } from 'react'
import Button from '../ui/Button.jsx'
import { categoryLabel } from '../ui/Badge.jsx'
import { useRecipes } from '../../hooks/useRecipes.js'

const CATEGORIES = ['APPETIZER', 'MAIN_COURSE', 'SIDE_DISH', 'DESSERT', 'SOUP', 'SALAD', 'DRINK']

function CourseSlot({ course, index, onChangeRecipe, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  const { data, isLoading } = useRecipes({ category: course.courseCategory, size: 100 })
  const recipes = data?.content ?? []

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-stone-700">{index + 1}. {categoryLabel(course.courseCategory)}</span>
        <div className="flex gap-1">
          <Button type="button" variant="ghost" className="py-1 px-2 text-xs" onClick={onMoveUp} disabled={isFirst}>↑</Button>
          <Button type="button" variant="ghost" className="py-1 px-2 text-xs" onClick={onMoveDown} disabled={isLast}>↓</Button>
          <Button type="button" variant="ghost" className="py-1 px-2 text-xs text-red-500 hover:text-red-700" onClick={onRemove}>×</Button>
        </div>
      </div>
      <select
        value={course.recipeId ?? ''}
        onChange={e => onChangeRecipe(e.target.value ? Number(e.target.value) : null)}
        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <option value="">Velg oppskrift...</option>
        {isLoading && <option disabled>Laster...</option>}
        {recipes.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
      </select>
    </div>
  )
}

export default function MenuBuilder({ value, onChange }) {
  const [categoryToAdd, setCategoryToAdd] = useState('MAIN_COURSE')

  function addCourse() {
    const next = [
      ...value,
      { courseCategory: categoryToAdd, recipeId: null, courseOrder: value.length + 1 }
    ]
    onChange(next)
  }

  function updateCourse(i, patch) {
    onChange(value.map((c, idx) => idx === i ? { ...c, ...patch } : c))
  }

  function removeCourse(i) {
    onChange(value.filter((_, idx) => idx !== i).map((c, idx) => ({ ...c, courseOrder: idx + 1 })))
  }

  function moveUp(i) {
    if (i === 0) return
    const next = [...value]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    onChange(next.map((c, idx) => ({ ...c, courseOrder: idx + 1 })))
  }

  function moveDown(i) {
    if (i === value.length - 1) return
    const next = [...value]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    onChange(next.map((c, idx) => ({ ...c, courseOrder: idx + 1 })))
  }

  return (
    <div className="space-y-3">
      {value.map((course, i) => (
        <CourseSlot
          key={i}
          course={course}
          index={i}
          onChangeRecipe={recipeId => updateCourse(i, { recipeId })}
          onRemove={() => removeCourse(i)}
          onMoveUp={() => moveUp(i)}
          onMoveDown={() => moveDown(i)}
          isFirst={i === 0}
          isLast={i === value.length - 1}
        />
      ))}
      <div className="flex gap-2">
        <select
          value={categoryToAdd}
          onChange={e => setCategoryToAdd(e.target.value)}
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{categoryLabel(c)}</option>)}
        </select>
        <Button type="button" variant="secondary" onClick={addCourse}>+ Legg til rett</Button>
      </div>
    </div>
  )
}
