import { useState } from 'react'
import './App.css'
import HealthCheck from './components/HealthCheck'
import Header from './components/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12 space-y-8">
        {/* Welcome Section */}
        <section className="bg-gradient-to-br from-purple-600 to-violet-700 text-white rounded-xl p-12 text-center shadow-xl">
          <h1 className="text-5xl font-bold mb-4">🏨 ROOM 911</h1>
          <p className="text-xl opacity-90">Management System</p>
          <p className="text-lg opacity-75 mt-2">Frontend React + Vite | Backend Spring Boot</p>
        </section>

        {/* Connectivity Check */}
        <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="pb-4 mb-4 border-b-2 border-purple-600">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-700 bg-clip-text text-transparent">Verificación de Conectividad</h2>
          </div>
          <HealthCheck />
        </section>

        {/* Demo Counter */}
        <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="pb-4 mb-4 border-b-2 border-purple-600">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-700 bg-clip-text text-transparent">Demo Counter</h2>
          </div>
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => setCount((count) => count + 1)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-lg font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/40 text-lg px-8 py-4"
            >
              Count is {count}
            </button>
            <p className="text-gray-600">
              Edit <code className="bg-gray-100 px-2 py-1 rounded font-mono text-purple-600">src/App.jsx</code> and save to test hot reload.
            </p>
          </div>
        </section>

        {/* System Status */}
        <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="pb-4 mb-4 border-b-2 border-purple-600">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-700 bg-clip-text text-transparent">Estado del Sistema</h2>
          </div>
          <ul className="grid gap-3">
            <li className="flex items-center p-3 bg-gray-50 rounded-lg border-l-4 border-green-500">
              <span className="inline-block mr-2 font-semibold text-green-600">✅</span>
              <span className="font-medium">Frontend: React 18 + Vite + Tailwind</span>
            </li>
            <li className="flex items-center p-3 bg-gray-50 rounded-lg border-l-4 border-yellow-500">
              <span className="inline-block mr-2 font-semibold text-yellow-600 animate-pulse">⏳</span>
              <span className="font-medium">Backend: Spring Boot (conectando...)</span>
            </li>
            <li className="flex items-center p-3 bg-gray-50 rounded-lg border-l-4 border-yellow-500">
              <span className="inline-block mr-2 font-semibold text-yellow-600 animate-pulse">⏳</span>
              <span className="font-medium">Base de Datos: PostgreSQL (configurar)</span>
            </li>
          </ul>
        </section>

        {/* Features */}
        <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="pb-4 mb-4 border-b-2 border-purple-600">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-700 bg-clip-text text-transparent">Características Implementadas</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-bold text-purple-900 mb-2">🎨 Diseño Moderno</h3>
              <p className="text-sm text-purple-700">Tailwind CSS con paleta de colores personalizada</p>
            </div>
            <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
              <h3 className="font-bold text-violet-900 mb-2">⚡ Hot Reload</h3>
              <p className="text-sm text-violet-700">Cambios se reflejan instantáneamente</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">🔌 API Client</h3>
              <p className="text-sm text-blue-700">Cliente HTTP integrado para backend</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-900 mb-2">📱 Responsive</h3>
              <p className="text-sm text-green-700">Diseño adaptable a cualquier dispositivo</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black bg-opacity-50 text-white text-center py-6 mt-auto">
        <p>ROOM 911 Management System © 2026</p>
      </footer>
    </>
  )
}

export default App
