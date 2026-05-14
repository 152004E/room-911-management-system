# ROOM 911 Management System

Sistema de gestión de habitaciones Full-Stack con **Spring Boot 3.x** (Backend) y **React + Vite** (Frontend).

## 📋 Requisitos Previos

- **Java 21 LTS** - [Descargar](https://www.oracle.com/java/technologies/downloads/#java21)
- **Maven 3.9+** - Incluido en la mayoría de instalaciones Java o [descargar](https://maven.apache.org/)
- **Node.js 18+** - [Descargar](https://nodejs.org/)
- **npm o yarn** - Se instala con Node.js
- **PostgreSQL 14+** - [Descargar](https://www.postgresql.org/download/)
- **Git** - Incluido en tu workspace

## 🚀 Instalación y Setup

### 1. Configurar variables de entorno

```bash
# En la raíz del proyecto
cp .env.example .env
# Edita .env con tus valores de PostgreSQL
```

### 2. Crear Base de Datos PostgreSQL

```bash
# Conectar a PostgreSQL
psql -U postgres

# En psql:
CREATE USER room911_user WITH PASSWORD 'your_secure_password_here';
CREATE DATABASE room911_db OWNER room911_user;
\l
\q
```

### 3. Instalar y Ejecutar Backend (Spring Boot)

```bash
cd backend

# Instalar dependencias Maven
mvn clean install

# Ejecutar el servidor
mvn spring-boot:run
```

El backend estará disponible en: **http://localhost:8080**

API Base: `http://localhost:8080/api`

### 4. Instalar y Ejecutar Frontend (React + Vite)

```bash
cd frontend

# Instalar dependencias npm
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

## 📁 Estructura del Proyecto

```
room-911-management-system/
├── backend/                    # Spring Boot API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/room911/
│   │   │   │       ├── Room911Application.java
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       └── entity/
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   └── pom.xml
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── .env.example               # Configuración de ejemplo
├── README.md                  # Este archivo
└── .git/
```

## 🔧 Comandos Útiles

### Backend (Spring Boot)

```bash
cd backend

# Instalar dependencias
mvn clean install

# Ejecutar servidor de desarrollo
mvn spring-boot:run

# Ejecutar tests
mvn test

# Empaquetar WAR/JAR
mvn package
```

### Frontend (React)

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview build local
npm run preview

# Ejecutar linter
npm run lint
```

## 🌐 Comunicación Backend-Frontend

El frontend se conecta al backend mediante la URL base configurada en `.env`:

```javascript
// frontend/src/services/api.js
const API_BASE_URL = process.env.REACT_API_BASE_URL || 'http://localhost:8080/api';

export const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  return response.json();
};
```

## ✅ Verificación de la Instalación

1. **Backend**: Ejecutar `mvn spring-boot:run` → debe iniciar sin errores en puerto 8080
2. **Frontend**: Ejecutar `npm run dev` → debe servir en puerto 5173
3. **Conectividad**: Abrir navegador → http://localhost:5173 (debe cargar la aplicación)

## 📚 Dependencias Instaladas

### Backend (Spring Boot 3.x)
- `spring-boot-starter-web` - MVC y REST
- `spring-boot-starter-data-jpa` - ORM y base de datos
- `org.postgresql:postgresql` - Driver PostgreSQL
- `org.projectlombok:lombok` - Anotaciones de reduce código
- `spring-boot-starter-validation` - Validación de datos
- `spring-boot-devtools` - Hot reload en desarrollo

### Frontend (React + Vite)
- `react` - Librería UI
- `react-dom` - Renderizado DOM
- `@vitejs/plugin-react` - Plugin React para Vite
- `eslint` - Linting
- `prettier` - Code formatting

## 🐛 Troubleshooting

### "Port 8080 already in use"
```bash
# Cambiar puerto en backend/src/main/resources/application.yml
server:
  port: 8081
```

### "Connection refused to PostgreSQL"
```bash
# Verificar que PostgreSQL está corriendo
psql -U postgres -d postgres -c "SELECT 1;"

# Si no funciona, reiniciar PostgreSQL
sudo service postgresql restart  # Linux
brew services restart postgresql # macOS
```

### "React no conecta al backend"
```bash
# Verificar CORS en backend está configurado
# Verificar URL en frontend/.env
# Verificar que backend está corriendo en http://localhost:8080
```

## 📝 Notas Importantes

- **Desarrollo**: Ambos servidores (backend + frontend) deben estar corriendo simultáneamente
- **Base de Datos**: Asegurate de tener PostgreSQL instalado y corriendo
- **Variables de Entorno**: Usar `.env` para configuración sensible (no comitear a git)
- **CORS**: Configurado en backend para aceptar requests desde http://localhost:5173 en desarrollo

## 🤝 Contribuir

Por favor sigue las convenciones de código y crea un PR con tus cambios.

## 📄 Licencia

Todos los derechos reservados © 2026 ROOM 911
