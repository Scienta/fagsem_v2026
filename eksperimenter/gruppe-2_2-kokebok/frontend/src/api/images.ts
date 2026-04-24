import client from './client'

export const uploadImage = (file: File) => {
  const form = new FormData()
  form.append('file', file)
  return client.post<{ filename: string; url: string }>('/api/images/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data)
}
