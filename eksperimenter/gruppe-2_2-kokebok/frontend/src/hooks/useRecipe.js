import { useState, useEffect } from 'react'
import { getRecipe } from '../api/recipes.js'

export function useRecipe(id) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    setIsLoading(true)

    getRecipe(id)
      .then(result => {
        if (!controller.signal.aborted) {
          setData(result)
          setIsLoading(false)
        }
      })
      .catch(err => {
        if (!controller.signal.aborted) {
          setError(err.message)
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [id])

  return { data, isLoading, error, setData }
}
