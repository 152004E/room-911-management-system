import { useState } from 'react'
import HealthCheck from '../components/HealthCheck'
import Header from '../components/Header'

function LandingPage() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12 space-y-8">
        {/* Welcome Section / Hero */}
        <section className="bg-gradient-to-br from-room-primary to-room-dark text-white rounded-room p-12 text-center shadow-glow border border-white/10">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">🏨 ROOM 911</h1>
          <p className="text-xl font-medium opacity-90">SISTEMA DE GESTIÓN INSTITUCIONAL</p>
          <div className="flex justify-center gap-4 mt-6">
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium border border-white/20">Protocolo de Seguridad v1.0</span>
            <span className="px-3 py-1 bg-room-success/20 text-room-success rounded-full text-sm font-medium border border-room-success/30">Validación Biométrica Activa</span>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Connectivity Check */}
          <section className="glass rounded-room p-6">
            <div className="pb-4 mb-4 border-b border-white/10">
              <h2 className="text-2xl font-bold text-room-primary">Ingesta de Datos y Conectividad</h2>
            </div>
            <HealthCheck />
          </section>

          {/* System Status */}
          <section className="glass rounded-room p-6">
            <div className="pb-4 mb-4 border-b border-white/10">
              <h2 className="text-2xl font-bold text-room-primary">Estado del Sistema</h2>
            </div>
            <ul className="grid gap-3">
              <li className="flex items-center p-3 bg-white/5 rounded-room border-l-4 border-room-success">
                <span className="inline-block mr-2 text-room-success">●</span>
                <span className="font-medium">Núcleo Operativo: React + Vite</span>
              </li>
              <li className="flex items-center p-3 bg-white/5 rounded-room border-l-4 border-room-primary">
                <span className="inline-block mr-2 text-room-primary animate-pulse">●</span>
                <span className="font-medium">Servidor Backend: Spring Boot 3.5.14</span>
              </li>
              <li className="flex items-center p-3 bg-white/5 rounded-room border-l-4 border-room-error">
                <span className="inline-block mr-2 text-room-error">●</span>
                <span className="font-medium">Base de Datos: PostgreSQL (Sin Conexión)</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Action Section */}
        <section className="glass rounded-room p-8 text-center">
          <div className="pb-4 mb-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-room-primary">Control de Acceso</h2>
          </div>
          <div className="flex flex-col items-center gap-6">
            <p className="text-white/70 max-w-lg">
              Inicie la validación del protocolo de seguridad para registrar nuevos accesos en el historial del sistema.
            </p>
            <button
              onClick={() => setCount((count) => count + 1)}
              className="px-10 py-4 bg-room-primary text-white rounded-room font-bold text-lg btn-glow"
            >
              Validar Acceso {count}
            </button>
            <p className="text-white/40 text-sm italic">
              ID de Sesión: 0x911-AC-{count}
            </p>
          </div>
        </section>

        {/* Features / Modules */}
        <section className="glass rounded-room p-6">
          <div className="pb-4 mb-4 border-b border-white/10">
            <h2 className="text-2xl font-bold text-room-primary">Módulos Administrativos</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white/5 rounded-room border border-white/10 hover:border-room-primary/50 transition-colors cursor-pointer">
              <div className="text-room-primary text-3xl mb-2">🛡️</div>
              <h3 className="font-bold text-white mb-1 text-sm">Seguridad</h3>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Protocolo Activo</p>
            </div>
            <div className="p-4 bg-white/5 rounded-room border border-white/10 hover:border-room-primary/50 transition-colors cursor-pointer">
              <div className="text-room-success text-3xl mb-2">📋</div>
              <h3 className="font-bold text-white mb-1 text-sm">Historial</h3>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Registros de Acceso</p>
            </div>
            <div className="p-4 bg-white/5 rounded-room border border-white/10 hover:border-room-primary/50 transition-colors cursor-pointer">
              <div className="text-room-error text-3xl mb-2">🚨</div>
              <h3 className="font-bold text-white mb-1 text-sm">Alertas</h3>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Incidentes Críticos</p>
            </div>
            <div className="p-4 bg-white/5 rounded-room border border-white/10 hover:border-room-primary/50 transition-colors cursor-pointer">
              <div className="text-white/50 text-3xl mb-2">⚙️</div>
              <h3 className="font-bold text-white mb-1 text-sm">Ajustes</h3>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Configuración</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 text-white/50 text-center py-6 mt-auto text-sm">
        <p>ROOM 911 | Sistema de Gestión y Monitoreo © 2026</p>
        <p className="text-[10px] mt-1 opacity-50">PRECISIÓN • SEGURIDAD • CONTROL</p>
      </footer>
    </div>
  )
}

export default LandingPage
