import { useEffect, useState } from 'react'

function Header() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)

  useEffect(() => {
    // Verificar conectividad al backend al cargar
    fetch('/api/health')
      .then((res) => res.json())
      .then(() => setIsConnected(true))
      .catch(() => setIsConnected(false))
  }, [])

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center gap-8">
        <h1 className="text-3xl font-bold text-room-primary">🏨 ROOM 911</h1>
        
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
          {isConnected === null && (
            <span className="flex items-center gap-2 text-white/50">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
              SINCRONIZANDO...
            </span>
          )}
          {isConnected && (
            <span className="flex items-center gap-2 text-room-success">
              <span className="w-2 h-2 rounded-full bg-room-success"></span>
              PROTOCOLO EN LÍNEA
            </span>
          )}
          {isConnected === false && (
            <span className="flex items-center gap-2 text-room-error">
              <span className="w-2 h-2 rounded-full bg-room-error"></span>
              FALLO DE ENLACE
            </span>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
