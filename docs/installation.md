# Guía de Instalación - ROOM 911 Management System

Esta guía detalla los pasos necesarios para instalar y configurar todos los componentes del proyecto ROOM 911 Management System: el Backend (Java Spring Boot), el Frontend (React + Vite) y el AI Service (Python FastAPI).

## 📋 1. Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas en tu sistema antes de comenzar:

- **Java 21 LTS** - [Descargar](https://www.oracle.com/java/technologies/downloads/#java21)
- **Maven 3.9+** - [Descargar](https://maven.apache.org/)
- **Node.js 18+** - [Descargar](https://nodejs.org/) (incluye npm)
- **Python 3.11+** - [Descargar](https://www.python.org/downloads/) (Recomendado usar `pyenv`)
- **PostgreSQL 14+** - [Descargar](https://www.postgresql.org/download/)
- **Git** - Para clonar el repositorio

---

## 🗄️ 2. Configuración de la Base de Datos

El sistema utiliza PostgreSQL para almacenar los datos.

1. Abre tu terminal y conéctate a PostgreSQL:
   ```bash
   psql -U postgres
   ```
2. Ejecuta los siguientes comandos para crear el usuario y la base de datos:
   ```sql
   CREATE USER room911_user WITH PASSWORD 'your_secure_password_here';
   CREATE DATABASE room911_db OWNER room911_user;
   \q
   ```

---

## ⚙️ 3. Instalación del Backend (Spring Boot)

El backend maneja la lógica de negocio y se conecta a la base de datos.

1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Configura las credenciales de la base de datos:
   - Abre o crea el archivo `src/main/resources/application.yml` o `application.properties`.
   - Asegúrate de que las credenciales coincidan con las que creaste en el paso 2 (`room911_user` y tu contraseña).
3. Instala las dependencias usando Maven:
   ```bash
   mvn clean install
   ```
4. Ejecuta el servidor:
   ```bash
   mvn spring-boot:run
   ```
   **El backend estará disponible en:** `http://localhost:8080`

---

## 🧠 4. Instalación del AI Service (Python)

El microservicio de inteligencia artificial se encarga del reconocimiento facial.

1. Navega a la carpeta del servicio de IA:
   ```bash
   cd ai-service
   ```
2. Configura tu entorno virtual (se recomienda usar la versión 3.11):
   ```bash
   pyenv local 3.11.9  # Si usas pyenv
   python -m venv venv311
   source venv311/bin/activate  # En Linux/macOS
   # venv311\Scripts\activate   # En Windows
   ```
3. Actualiza `pip` e instala las dependencias:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```
4. Inicia el servidor usando Uvicorn:
   ```bash
   uvicorn main:app --reload --port 8001
   ```
   **El AI Service estará disponible en:** `http://localhost:8001`

---

## 💻 5. Instalación del Frontend (React + Vite)

El frontend proporciona la interfaz de usuario para los administradores y el kiosco de acceso.

1. Navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Configura las variables de entorno:
   - Copia el archivo `.env.example` a `.env`:
     ```bash
     cp .env.example .env
     ```
   - Verifica que las URLs apunten a tus servicios backend y de IA. Por defecto, conectará a `http://localhost:8080/api`.
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   **El frontend estará disponible en:** `http://localhost:5173`

---

## ✅ Verificación Final

Para confirmar que todo está funcionando correctamente, verifica lo siguiente:

1. El Backend en `http://localhost:8080` no arroja errores en consola y se conectó a PostgreSQL.
2. El AI Service en `http://localhost:8001/health` responde correctamente o muestra los logs de inicio de FastAPI.
3. El Frontend en `http://localhost:5173` carga la pantalla de inicio o el panel de autenticación en tu navegador.

Si encuentras algún problema de puertos (ej. `Port 8080 already in use`), asegúrate de liberar el puerto o cambiar el puerto en la configuración de la aplicación correspondiente.
