import client from './client'
import type { MenuResponse, Recipe } from '../types/Recipe'

export const menuApi = {
  suggest: () => client.get<Record<string, Recipe>>('/api/menu/suggest').then(r => r.data),
  build: (categorySelections: Record<string, number>) =>
    client.post<MenuResponse>('/api/menu/build', { categorySelections }).then(r => r.data),
}
