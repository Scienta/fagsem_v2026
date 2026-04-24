import { useRef } from 'react'
import { uploadImage } from '../api/images'

interface Props {
  currentImageUrl: string | null
  onUploaded: (filename: string) => void
}

export default function ImageUpload({ currentImageUrl, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const result = await uploadImage(file)
    onUploaded(result.filename)
  }

  return (
    <div className="image-upload">
      {currentImageUrl && (
        <img src={currentImageUrl} alt="Bilde" className="image-upload__preview" />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        aria-label="Last opp bilde"
      />
    </div>
  )
}
