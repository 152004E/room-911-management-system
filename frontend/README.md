# Frontend - ROOM 911 Management System

Frontend React + Vite para ROOM 911 Management System.

## 📁 Estructura

```
frontend/
├── src/
│   ├── components/              # Componentes React reutilizables
│   │   ├── Header.jsx          # Encabezado con status
│   │   └── HealthCheck.jsx     # Componente de verificación
│   ├── pages/                  # Páginas principales (agregar después)
│   ├── services/               # Servicios (API calls)
│   │   └── api.js             # Cliente HTTP
│   ├── hooks/                  # Custom React Hooks
│   │   └── useFetch.js        # Hook para datos
│   ├── styles/                # Estilos CSS
│   │   └── index.css          # Estilos globales
│   ├── App.jsx                # Componente principal
│   ├── App.css                # Estilos App
│   └── main.jsx               # Entrada de la aplicación
├── public/                     # Archivos estáticos
├── index.html                  # HTML principal
├── package.json               # Dependencias npm
├── vite.config.js             # Configuración Vite
├── .eslintrc.js               # Reglas ESLint
├── .prettierrc                 # Configuración Prettier
├── .gitignore                  # Archivos ignorados por git
└── README.md                   # Este archivo
```

## 🚀 Instalar y Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo (hot reload)
npm run dev

# Build para producción
npm run build

# Preview build local
npm run preview

# Ejecutar linter
npm run lint
```

El servidor estará disponible en: **http://localhost:5173**

## 🔌 API Integration

### Cliente HTTP: `src/services/api.js`

```javascript
import api from './services/api'

// GET request
const data = await api.get('/health')

// POST request
const result = await api.post('/rooms', { name: 'Room 101' })

// PUT request
await api.put('/rooms/1', { status: 'occupied' })

// DELETE request
await api.delete('/rooms/1')
```

### Custom Hook: `src/hooks/useFetch.js`

```javascript
import useFetch from './hooks/useFetch'

function Component() {
  const { data, loading, error } = useFetch('/rooms')

  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error}</p>

  return <div>{/* renderizar data */}</div>
}
```

## 📚 Dependencias Principales

- **React 18** - Librería UI
- **React DOM 18** - Renderizado en navegador
- **Vite 5** - Build tool y dev server
- **ESLint** - Linting
- **Prettier** - Code formatting

## 🎨 Estilos

- Diseño responsivo con CSS3
- Paleta de colores: Púrpura/Lavanda (#667eea, #764ba2)
- Mobile-first approach
- Animaciones suaves

## 🔄 Hot Reload

Con Vite, los cambios en código se reflejan instantáneamente en el navegador sin perder el estado.

```bash
npm run dev
# Edita código → se recarga automáticamente en http://localhost:5173
```

## 🌐 CORS y Proxy

En desarrollo, los requests a `/api/*` se redirigen automáticamente al backend en `http://localhost:8080` mediante el proxy de Vite (ver `vite.config.js`).

## 📝 Notas

- Node.js 18+ requerido
- npm 9+ recomendado
- Backend (Spring Boot) debe estar corriendo en puerto 8080
- Variables de entorno en `.env.local` (no commitar a git)
