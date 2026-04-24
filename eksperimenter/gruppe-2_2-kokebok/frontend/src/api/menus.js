import { get, post, put, del } from './client.js'

export const getMenus = () => get('/menus')
export const getMenu = (id) => get(`/menus/${id}`)
export const createMenu = (data) => post('/menus', data)
export const updateMenu = (id, data) => put(`/menus/${id}`, data)
export const deleteMenu = (id) => del(`/menus/${id}`)
