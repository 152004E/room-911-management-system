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
        className="px-6 py-3 bg-room-primary text-white rounded-room font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed btn-glow"
      >
        {loading ? '🔄 Sincronizando...' : '✓ Iniciar Validación'}
      </button>

      {error && (
        <div className="p-4 rounded-room border-l-4 bg-room-error/10 border-room-error text-room-error">
          <strong>❌ Error de Protocolo</strong>
          <p className="mt-2 text-white/80">{error}</p>
          <p className="text-sm opacity-75 mt-2">
            Verifique el estado del servidor backend (8080)<br/>
            Comando: <code className="bg-room-error/20 px-2 py-1 rounded font-mono text-white">mvn spring-boot:run</code>
          </p>
        </div>
      )}

      {data && (
        <div className="p-4 rounded-room border-l-4 bg-room-success/10 border-room-success text-room-success">
          <strong>✅ Validación Exitosa</strong>
          <p className="mt-2 text-white/80">
            <span className="font-semibold">Estado:</span> {data.status}
          </p>
          <p className="mt-1 text-white/80">{data.message}</p>
        </div>
      )}
    </div>
  )
}

export default HealthCheck
