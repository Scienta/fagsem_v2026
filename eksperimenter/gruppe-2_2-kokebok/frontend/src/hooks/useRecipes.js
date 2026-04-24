import { useState, useEffect } from 'react'
import { searchRecipes } from '../api/recipes.js'

export function useRecipes(params) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    searchRecipes(params)
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
  }, [JSON.stringify(params)])

  return { data, isLoading, error }
}
