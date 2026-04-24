import type { FlavorTag } from '../types/Recipe'

const ALL_FLAVORS: FlavorTag[] = ['SPICY', 'SWEET', 'SOUR', 'SALTY', 'UMAMI', 'BITTER', 'MILD']

interface Props {
  selected: FlavorTag[]
  onChange: (tags: FlavorTag[]) => void
}

export default function FlavorTagSelector({ selected, onChange }: Props) {
  const toggle = (tag: FlavorTag) => {
    if (selected.includes(tag)) {
      onChange(selected.filter(t => t !== tag))
    } else {
      onChange([...selected, tag])
    }
  }

  return (
    <div className="flavor-tags">
      {ALL_FLAVORS.map(tag => (
        <label key={tag} className="flavor-tag">
          <input
            type="checkbox"
            checked={selected.includes(tag)}
            onChange={() => toggle(tag)}
          />
          {tag}
        </label>
      ))}
    </div>
  )
}
