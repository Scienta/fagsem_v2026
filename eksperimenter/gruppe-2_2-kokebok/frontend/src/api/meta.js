import { get } from './client.js'

export const getCategories = () => get('/meta/categories')
export const getCuisines = () => get('/meta/cuisines')
export const getFlavors = () => get('/meta/flavors')
