import { useState } from 'react'
import { Button } from './globalcomponent/Button'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

interface HealthResponse {
  status: string;
  message: string;
  dbStatus: string;
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
      <Button
        onClick={checkHealth}
        isLoading={loading}
        text="Iniciar Validación"
        iconLeft={faCheck}
        loadingText="Sincronizando..."
        variant="primary"
        className="w-full md:w-auto"
      />

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
          <div className="mt-2 space-y-1 text-white/80">
            <p><span className="font-semibold">Backend:</span> {data.status}</p>
            <p><span className="font-semibold">Base de Datos:</span> 
              <span className={data.dbStatus === 'CONNECTED' ? 'text-room-success ml-2' : 'text-room-error ml-2'}>
                {data.dbStatus}
              </span>
            </p>
            <p className="text-xs opacity-50 italic mt-2">{data.message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default HealthCheck
