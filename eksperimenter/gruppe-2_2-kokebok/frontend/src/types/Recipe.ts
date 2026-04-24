export type RecipeCategory = 'FORRETT' | 'HOVEDRETT' | 'DESSERT' | 'SNACK' | 'DRIKKE'
export type FlavorTag = 'SPICY' | 'SWEET' | 'SOUR' | 'SALTY' | 'UMAMI' | 'BITTER' | 'MILD'

export interface Ingredient {
  id?: number
  sortOrder: number
  name: string
  quantity: number | null
  unit: string
}

export interface RecipeStep {
  id?: number
  stepNumber: number
  instruction: string
}

export interface Recipe {
  id: number
  title: string
  description: string
  cuisine: string
  category: RecipeCategory
  flavorTags: FlavorTag[]
  prepTimeMinutes: number | null
  cookTimeMinutes: number | null
  servings: number | null
  imageFilename: string | null
  imageUrl: string | null
  ingredients: Ingredient[]
  steps: RecipeStep[]
  createdAt: string
  updatedAt: string
}

export type RecipeInput = Omit<Recipe, 'id' | 'imageUrl' | 'createdAt' | 'updatedAt'>

export interface SearchParams {
  q?: string
  cuisine?: string
  category?: string
  ingredient?: string
  flavors?: string[]
}

export interface MenuResponse {
  dishes: Recipe[]
  totalTimeMinutes: number
}
