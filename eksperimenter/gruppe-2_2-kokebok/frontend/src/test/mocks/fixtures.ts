import type { Recipe } from '../../types/Recipe'

export const mockRecipe: Recipe = {
  id: 1,
  title: 'Pasta Carbonara',
  description: 'Klassisk italiensk pasta',
  cuisine: 'Italiensk',
  category: 'HOVEDRETT',
  flavorTags: ['SALTY', 'UMAMI'],
  prepTimeMinutes: 10,
  cookTimeMinutes: 20,
  servings: 4,
  imageFilename: null,
  imageUrl: null,
  ingredients: [
    { id: 1, sortOrder: 0, name: 'Spaghetti', quantity: 200, unit: 'gram' },
    { id: 2, sortOrder: 1, name: 'Egg', quantity: 3, unit: 'stk' },
  ],
  steps: [
    { id: 1, stepNumber: 1, instruction: 'Kok pastaen i saltet vann' },
    { id: 2, stepNumber: 2, instruction: 'Bland egg og ost' },
  ],
  createdAt: '2026-04-24T10:00:00',
  updatedAt: '2026-04-24T10:00:00',
}

export const mockRecipe2: Recipe = {
  id: 2,
  title: 'Laksesushi',
  description: 'Frisk sushi med laks',
  cuisine: 'Japansk',
  category: 'FORRETT',
  flavorTags: ['SOUR', 'UMAMI'],
  prepTimeMinutes: 30,
  cookTimeMinutes: 0,
  servings: 2,
  imageFilename: null,
  imageUrl: null,
  ingredients: [{ id: 3, sortOrder: 0, name: 'Laks', quantity: 200, unit: 'gram' }],
  steps: [{ id: 3, stepNumber: 1, instruction: 'Lag sushiris' }],
  createdAt: '2026-04-24T11:00:00',
  updatedAt: '2026-04-24T11:00:00',
}

export const mockRecipes = [mockRecipe, mockRecipe2]
