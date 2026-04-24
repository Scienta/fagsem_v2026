import { useState, useEffect } from 'react'
import { getMenus, getMenu } from '../api/menus.js'

export function useMenus() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMenus()
      .then(result => { setData(result); setIsLoading(false) })
      .catch(err => { setError(err.message); setIsLoading(false) })
  }, [])

  return { data, isLoading, error }
}

export function useMenu(id) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    getMenu(id)
      .then(result => { setData(result); setIsLoading(false) })
      .catch(err => { setError(err.message); setIsLoading(false) })
  }, [id])

  return { data, isLoading, error }
}
