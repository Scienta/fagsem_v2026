const colors = {
  category: 'bg-amber-100 text-amber-800',
  cuisine: 'bg-blue-100 text-blue-800',
  flavor: 'bg-green-100 text-green-800',
  default: 'bg-stone-100 text-stone-700',
}

const CATEGORY_LABELS = {
  APPETIZER: 'Forrett',
  MAIN_COURSE: 'Hovedrett',
  SIDE_DISH: 'Tilbehør',
  DESSERT: 'Dessert',
  SOUP: 'Suppe',
  SALAD: 'Salat',
  DRINK: 'Drikke',
}

const CUISINE_LABELS = {
  NORWEGIAN: 'Norsk',
  ITALIAN: 'Italiensk',
  FRENCH: 'Fransk',
  CHINESE: 'Kinesisk',
  JAPANESE: 'Japansk',
  INDIAN: 'Indisk',
  MEXICAN: 'Meksikansk',
  THAI: 'Thailandsk',
  GREEK: 'Gresk',
  AMERICAN: 'Amerikansk',
  MIDDLE_EASTERN: 'Midtøsten',
  SPANISH: 'Spansk',
  OTHER: 'Annet',
}

const FLAVOR_LABELS = {
  SPICY: 'Krydret',
  SWEET: 'Søt',
  SAVORY: 'Smakfull',
  SOUR: 'Sur',
  UMAMI: 'Umami',
  BITTER: 'Bitter',
  SMOKY: 'Røkt',
  MILD: 'Mild',
}

export function categoryLabel(v) { return CATEGORY_LABELS[v] ?? v }
export function cuisineLabel(v) { return CUISINE_LABELS[v] ?? v }
export function flavorLabel(v) { return FLAVOR_LABELS[v] ?? v }

export default function Badge({ type = 'default', value }) {
  const label = type === 'category' ? categoryLabel(value)
    : type === 'cuisine' ? cuisineLabel(value)
    : type === 'flavor' ? flavorLabel(value)
    : value

  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[type] ?? colors.default}`}>
      {label}
    </span>
  )
}
