import { get, post, put, del, postForm } from './client.js'

export function searchRecipes(params) {
  const q = new URLSearchParams()
  if (params.q) q.set('q', params.q)
  if (params.category) q.set('category', params.category)
  if (params.cuisine) q.set('cuisine', params.cuisine)
  if (params.ingredient) q.set('ingredient', params.ingredient)
  if (params.flavor) params.flavor.forEach(f => q.append('flavor', f))
  if (params.page != null) q.set('page', params.page)
  if (params.size != null) q.set('size', params.size)
  return get(`/recipes?${q}`)
}

export const getRecipe = (id) => get(`/recipes/${id}`)
export const createRecipe = (data) => post('/recipes', data)
export const updateRecipe = (id, data) => put(`/recipes/${id}`, data)
export const deleteRecipe = (id) => del(`/recipes/${id}`)

export function uploadImage(recipeId, file) {
  const form = new FormData()
  form.append('file', file)
  return postForm(`/recipes/${recipeId}/images`, form)
}

export const deleteImage = (recipeId, imageId) => del(`/recipes/${recipeId}/images/${imageId}`)
