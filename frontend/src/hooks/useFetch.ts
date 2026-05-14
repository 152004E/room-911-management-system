/**
 * Custom Hook para realizar requests al backend
 * Maneja loading, error y data automáticamente
 */

import { useState, useEffect } from 'react'
import api from '../services/api'

export const useFetch = <T = any>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await api.get<T>(endpoint)
        setData(result)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Error desconocido')
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
