/**
 * Custom Hook para realizar requests al backend
 * Maneja loading, error y data automáticamente
 */

import { useState, useEffect } from 'react'
import api from '../services/api'

export const useFetch = (endpoint, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await api.get(endpoint)
        setData(result)
        setError(null)
      } catch (err) {
        setError(err.message)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    if (endpoint) {
      fetchData()
    }
  }, [endpoint])

  return { data, loading, error }
}

export default useFetch
