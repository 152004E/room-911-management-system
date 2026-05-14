import { useState } from 'react'

interface HealthResponse {
  status: string;
  message: string;
}

function HealthCheck() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<HealthResponse | null>(null)

  const checkHealth = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/health')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      setData(result)
    } catch (err: any) {
      setError(err.message || 'Error desconocido')
      console.error('Error al conectar con backend:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={checkHealth}
        disabled={loading}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/40"
      >
        {loading ? '🔄 Verificando...' : '✓ Verificar Backend'}
      </button>

      {error && (
        <div className="p-4 rounded-lg border-l-4 bg-red-50 border-red-500 text-red-900">
          <strong>❌ Error de Conexión</strong>
          <p className="mt-2">{error}</p>
          <p className="text-sm opacity-75 mt-2">
            Asegúrate que el backend está corriendo en http://localhost:8080<br/>
            Ejecuta: <code className="bg-red-100 px-2 py-1 rounded font-mono">mvn spring-boot:run</code>
          </p>
        </div>
      )}

      {data && (
        <div className="p-4 rounded-lg border-l-4 bg-green-50 border-green-500 text-green-900">
          <strong>✅ Conexión Exitosa</strong>
          <p className="mt-2">
            <span className="font-semibold">Estado:</span> {data.status}
          </p>
          <p className="mt-1">{data.message}</p>
        </div>
      )}
    </div>
  )
}

export default HealthCheck
