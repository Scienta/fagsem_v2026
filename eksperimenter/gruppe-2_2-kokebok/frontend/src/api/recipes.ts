import client from './client'
import type { Recipe, RecipeInput, SearchParams } from '../types/Recipe'

export const recipeApi = {
  list: () => client.get<Recipe[]>('/api/recipes').then(r => r.data),
  get: (id: number) => client.get<Recipe>(`/api/recipes/${id}`).then(r => r.data),
  search: (params: SearchParams) => client.get<Recipe[]>('/api/recipes/search', { params }).then(r => r.data),
  create: (data: RecipeInput) => client.post<Recipe>('/api/recipes', data).then(r => r.data),
  update: (id: number, data: RecipeInput) => client.put<Recipe>(`/api/recipes/${id}`, data).then(r => r.data),
  remove: (id: number) => client.delete(`/api/recipes/${id}`),
  categories: () => client.get<string[]>('/api/recipes/categories').then(r => r.data),
  flavors: () => client.get<string[]>('/api/recipes/flavors').then(r => r.data),
  cuisines: () => client.get<string[]>('/api/recipes/cuisines').then(r => r.data),
}
