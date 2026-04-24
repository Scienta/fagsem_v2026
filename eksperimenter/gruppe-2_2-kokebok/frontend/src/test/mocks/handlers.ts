import { http, HttpResponse } from 'msw'
import { mockRecipe, mockRecipe2, mockRecipes } from './fixtures'

export const handlers = [
  http.get('/api/recipes', () => HttpResponse.json(mockRecipes)),

  http.get('/api/recipes/search', () => HttpResponse.json(mockRecipes)),

  http.get('/api/recipes/categories', () =>
    HttpResponse.json(['FORRETT', 'HOVEDRETT', 'DESSERT', 'SNACK', 'DRIKKE'])),

  http.get('/api/recipes/flavors', () =>
    HttpResponse.json(['SPICY', 'SWEET', 'SOUR', 'SALTY', 'UMAMI', 'BITTER', 'MILD'])),

  http.get('/api/recipes/cuisines', () =>
    HttpResponse.json(['Italiensk', 'Japansk', 'Norsk'])),

  http.get('/api/recipes/:id', ({ params }) => {
    const id = Number(params.id)
    const recipe = mockRecipes.find(r => r.id === id)
    if (!recipe) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(recipe)
  }),

  http.post('/api/recipes', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ ...mockRecipe, ...body, id: 99 }, { status: 201 })
  }),

  http.put('/api/recipes/:id', async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ ...mockRecipe, ...body, id: Number(params.id) })
  }),

  http.delete('/api/recipes/:id', () => new HttpResponse(null, { status: 204 })),

  http.post('/api/images/upload', () =>
    HttpResponse.json({ filename: 'test.jpg', url: '/images/test.jpg' })),

  http.get('/api/menu/suggest', () =>
    HttpResponse.json({ FORRETT: mockRecipe2, HOVEDRETT: mockRecipe })),

  http.post('/api/menu/build', () =>
    HttpResponse.json({ dishes: [mockRecipe2, mockRecipe], totalTimeMinutes: 60 })),
]
