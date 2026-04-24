const BASE = '/api/v1'

async function request(path, options = {}) {
  const headers = options.body instanceof FormData
    ? { ...options.headers }
    : { 'Content-Type': 'application/json', ...options.headers }

  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error')
    throw new Error(`API ${res.status}: ${text}`)
  }

  if (res.status === 204) return null
  return res.json()
}

export const get = (path) => request(path)
export const post = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) })
export const put = (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) })
export const del = (path) => request(path, { method: 'DELETE' })
export const postForm = (path, formData) => request(path, { method: 'POST', body: formData })
