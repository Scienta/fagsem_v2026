import { useState, useRef } from 'react'
import { uploadImage, deleteImage } from '../../api/recipes.js'
import Button from '../ui/Button.jsx'

export default function ImageUpload({ recipeId, images, onImagesChange }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const newImg = await uploadImage(recipeId, file)
      onImagesChange([...images, newImg])
    } catch (err) {
      alert('Bildeopplasting feilet: ' + err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleDelete(imageId) {
    try {
      await deleteImage(recipeId, imageId)
      onImagesChange(images.filter(img => img.id !== imageId))
    } catch (err) {
      alert('Sletting feilet: ' + err.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {images.map(img => (
          <div key={img.id} className="relative group w-32 h-32 rounded-lg overflow-hidden border border-stone-200">
            <img src={img.url} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()} disabled={uploading}>
        {uploading ? 'Laster opp...' : '+ Last opp bilde'}
      </Button>
    </div>
  )
}
