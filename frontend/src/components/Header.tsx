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
    <header className="sticky top-0 z-50 bg-white/95 border-b-4 border-purple-600 shadow-md backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center gap-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-700 bg-clip-text text-transparent">🏨 ROOM 911</h1>
        
        <div className="flex items-center gap-3 text-sm font-semibold">
          {isConnected === null && (
            <span className="inline-block mr-2 font-semibold text-yellow-600 animate-pulse">⏳ Conectando...</span>
          )}
          {isConnected && (
            <span className="inline-block mr-2 font-semibold text-green-600">✅ Backend OK</span>
          )}
          {isConnected === false && (
            <span className="inline-block mr-2 font-semibold text-red-600">❌ Backend Desconectado</span>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
