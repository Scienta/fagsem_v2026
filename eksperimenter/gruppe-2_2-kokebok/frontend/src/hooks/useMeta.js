import { useState, useEffect } from 'react'
import { getCategories, getCuisines, getFlavors } from '../api/meta.js'

export function useMeta() {
  const [categories, setCategories] = useState([])
  const [cuisines, setCuisines] = useState([])
  const [flavors, setFlavors] = useState([])

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
    getCuisines().then(setCuisines).catch(() => {})
    getFlavors().then(setFlavors).catch(() => {})
  }, [])

  return { categories, cuisines, flavors }
}
