/**
 * Cliente HTTP para comunicación con el backend
 * Todos los requests se envían a través de este servicio
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const apiCall = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`

  // Obtener el token del localStorage
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Redirigir al login si el token es inválido o expiró
        localStorage.removeItem('token');
        if (window.location.pathname !== '/auth/login') {
            window.location.href = '/auth/login';
        }
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error en ${endpoint}:`, error)
    throw error
  }
}

// Métodos auxiliares para requests comunes
export const api = {
  get: <T = any>(endpoint: string) => apiCall<T>(endpoint, { method: 'GET' }),
  post: <T = any>(endpoint: string, body: any) => apiCall<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T = any>(endpoint: string, body: any) => apiCall<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T = any>(endpoint: string) => apiCall<T>(endpoint, { method: 'DELETE' }),
}

export const authApi = {
  login: (data: { identifier: string; password: string }) => api.post('/auth/admin/login', data),
}

export default api
