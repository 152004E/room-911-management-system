# Arquitectura del Proyecto ROOM_911 Management System

## Estructura del Proyecto

```
room-911-management-system/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/room911/
│   │   │   │   ├── config/              # Configuración de Spring
│   │   │   │   │   └── CorsConfig.java
│   │   │   │   ├── controller/          # Controladores REST
│   │   │   │   │   ├── auth/            # Autenticación y acceso
│   │   │   │   │   │   ├── AdminLoginController.java
│   │   │   │   │   │   └── EmployeeAccessController.java
│   │   │   │   │   ├── DepartmentController.java
│   │   │   │   │   ├── EmployeeController.java
│   │   │   │   │   ├── AccessLogController.java
│   │   │   │   │   └── AdminController.java
│   │   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   │   ├── EmployeeDTO.java
│   │   │   │   │   ├── DepartmentDTO.java
│   │   │   │   │   ├── AdminUserDTO.java
│   │   │   │   │   └── AccessLogDTO.java
│   │   │   │   ├── entity/              # Entidades JPA
│   │   │   │   │   ├── Employee.java
│   │   │   │   │   ├── Department.java
│   │   │   │   │   ├── AdminUser.java
│   │   │   │   │   └── AccessLog.java
│   │   │   │   ├── repository/          # Spring Data JPA Repositories
│   │   │   │   │   ├── EmployeeRepository.java
│   │   │   │   │   ├── DepartmentRepository.java
│   │   │   │   │   ├── AdminUserRepository.java
│   │   │   │   │   └── AccessLogRepository.java
│   │   │   │   ├── service/             # Interfaces de servicios
│   │   │   │   │   ├── EmployeeService.java
│   │   │   │   │   ├── DepartmentService.java
│   │   │   │   │   ├── AdminUserService.java
│   │   │   │   │   └── AccessLogService.java
│   │   │   │   ├── service/impl/        # Implementaciones de servicios
│   │   │   │   │   ├── EmployeeServiceImpl.java
│   │   │   │   │   ├── DepartmentServiceImpl.java
│   │   │   │   │   ├── AdminUserServiceImpl.java
│   │   │   │   │   ├── AccessLogServiceImpl.java
│   │   │   │   │   └── EmployeeCSVService.java
│   │   │   │   └── security/            # Utilidades de seguridad JWT
│   │   │   │       └── JwtUtil.java
│   │   │   └── resources/
│   │   │       └── application.yml      # Configuración de aplicación
│   │   └── test/
│   │       └── java/com/room911/        # Tests unitarios
│   ├── pom.xml                          # Dependencias Maven
│   └── target/                          # Artefactos compilados
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                    # Componentes de autenticación
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── globalcomponent/         # Componentes reutilizables
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Header.tsx
│   │   │   └── DateRangePicker.tsx      # Selector de rango de fechas
│   │   ├── pages/
│   │   │   ├── admin/                   # Páginas administrativas
│   │   │   │   ├── DashboardPage.tsx    # Panel de control
│   │   │   │   ├── EmployeesPage.tsx    # Gestión de empleados
│   │   │   │   ├── DepartmentsPage.tsx  # Gestión de departamentos
│   │   │   │   ├── AdminsPage.tsx       # Gestión de administradores
│   │   │   │   ├── AccessLogsPage.tsx   # Historial de accesos
│   │   │   │   ├── ReportsPage.tsx      # Reportes y estadísticas
│   │   │   │   └── ArchivedItemsPage.tsx # Gestión de archivos
│   │   │   └── auth/
│   │   │       ├── LoginPage.tsx
│   │   │       └── ForgotPasswordPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts                   # Cliente HTTP con interceptores
│   │   │   └── alerts.ts                # Servicio de notificaciones
│   │   ├── hooks/
│   │   │   ├── useAuth.ts               # Hook de autenticación
│   │   │   └── useProtected.ts          # Hook de rutas protegidas
│   │   ├── layouts/
│   │   │   ├── AuthLayout.tsx           # Layout para login
│   │   │   └── DashboardLayout.tsx      # Layout para admin
│   │   ├── types/
│   │   │   └── room911.types.ts         # Tipos TypeScript globales
│   │   ├── utils/
│   │   │   └── generateAccessHistoryPDF.ts # Generador de PDF
│   │   ├── styles/
│   │   │   ├── globals.css              # Estilos globales
│   │   │   └── tailwind.css             # Configuración Tailwind
│   │   ├── App.tsx                      # Componente raíz
│   │   └── main.tsx                     # Punto de entrada
│   ├── public/                          # Assets estáticos
│   │   ├── logo.png
│   │   └── employees_example.csv
│   ├── package.json                     # Dependencias npm
│   ├── tsconfig.json                    # Configuración TypeScript
│   ├── vite.config.ts                   # Configuración Vite
│   └── tailwind.config.ts               # Configuración Tailwind CSS
│
├── ai-service/                          # Microservicio de IA (Python)
│   ├── main.py                          # Aplicación FastAPI principal
│   ├── config.py                        # Configuración de reconocimiento facial
│   ├── test_service.py                  # Tests del servicio
│   ├── requirements.txt                 # Dependencias Python (pip)
│   ├── venv/                            # Virtual environment (generado)
│   ├── faces/                           # Almacenamiento de rostros registrados
│   │   └── {employee_id}.jpg            # Imágenes registradas por empleado
│   ├── failed_attempts/                 # Log de intentos fallidos
│   │   └── employee_{id}_{timestamp}.jpg
│   ├── .pylintrc                        # Configuración Pylint
│   ├── pyrightconfig.json               # Configuración Pyright (type checking)
│   ├── README.md                        # Documentación del servicio
│   ├── QUICKSTART.md                    # Guía rápida
│   └── SETUP_VSCODE.md                  # Configuración VS Code
│
├── CLAUDE.md                            # Guía para Claude Code
├── architecture.md                      # Este archivo
└── README.md                            # Documentación del proyecto
```

---

## Tecnologías Utilizadas

### Backend

| Categoría | Tecnología | Versión | Propósito |
|-----------|-----------|---------|----------|
| **Framework** | Spring Boot | 3.5.14 | Framework web principal |
| **Lenguaje** | Java | 21 | Lenguaje de programación |
| **ORM** | Hibernate (JPA) | - | Mapeo objeto-relacional |
| **Base de Datos** | PostgreSQL | 14+ | Base de datos relacional |
| **Build** | Maven | - | Gestor de dependencias |
| **Seguridad** | Spring Security | - | Autenticación y autorización |
| **JWT** | JSON Web Tokens | - | Tokens de autenticación |
| **CSV** | OpenCSV | - | Importación de archivos CSV |

**Dependencias principales en pom.xml:**
```xml
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- postgresql (driver)
- spring-boot-devtools
- hibernate-core
- opencsv
```

---

### Frontend

| Categoría | Tecnología | Versión | Propósito |
|-----------|-----------|---------|----------|
| **Framework** | React | 18.2.0 | Biblioteca UI |
| **Lenguaje** | TypeScript | 6.0.3 | Tipado estático |
| **Build Tool** | Vite | 5.0.8 | Bundler y dev server |
| **Routing** | React Router DOM | 7.15.1 | Navegación SPA |
| **Estilos** | Tailwind CSS | 4.3.0 | Utility-first CSS |
| **Iconos** | FontAwesome | 7.2.0 | Librería de iconos |
| **Gráficos** | Recharts | 3.8.1 | Visualización de datos |
| **Alertas** | SweetAlert2 | 11.26.24 | Notificaciones modales |
| **PDF** | jsPDF | - | Generación de PDFs |
| **Linting** | ESLint | 8.56.0 | Linting de código |
| **Linting** | Prettier | 3.1.1 | Formateador de código |

**Dependencias en package.json:**
```json
{
  "dependencies": {
    "@fortawesome/fontawesome-svg-core": "^7.2.0",
    "@fortawesome/free-solid-svg-icons": "^7.2.0",
    "@fortawesome/react-fontawesome": "^3.3.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^7.15.1",
    "recharts": "^3.8.1",
    "sweetalert2": "^11.26.24",
    "jspdf": "^2.x.x",
    "html2canvas": "^1.x.x"
  }
}
```

---

### AI Service (Microservicio Python)

| Categoría | Tecnología | Versión | Propósito |
|-----------|-----------|---------|----------|
| **Framework** | FastAPI | - | API REST ligero y rápido |
| **Lenguaje** | Python | 3.8+ | Lenguaje de IA/ML |
| **Servidor ASGI** | Uvicorn | - | Servidor web asincrónico |
| **Reconocimiento Facial** | face_recognition | - | Detección y comparación de rostros (dlib) |
| **Visión Computacional** | OpenCV (cv2) | - | Procesamiento de imágenes |
| **Arrays Numéricos** | NumPy | - | Operaciones numéricas |
| **Procesamiento Imágenes** | Pillow (PIL) | - | Manipulación de imágenes |
| **Serialización** | Pydantic | - | Validación y serialización de modelos |
| **Validación Multipart** | python-multipart | - | Manejo de formularios multipart |

**Dependencias en requirements.txt:**
```
fastapi>=0.104.1
uvicorn[standard]>=0.24.0
face-recognition>=1.3.5
opencv-python>=4.8.1.78
numpy>=1.24.0
pillow>=10.1.0
pydantic>=2.4.2
python-multipart>=0.0.6
requests>=2.31.0
```

---

## Patrones Arquitectónicos

### Backend

1. **MVC (Model-View-Controller)**
   - **Model**: Entidades JPA en `entity/`
   - **View**: DTOs en `dto/`
   - **Controller**: Controladores REST en `controller/`

2. **Service Layer Pattern**
   - Interfaces en `service/`
   - Implementaciones en `service/impl/`
   - Lógica de negocio centralizada

3. **Repository Pattern**
   - Spring Data JPA repositories
   - Consultas personalizadas con `@Query`

4. **Soft Delete Pattern**
   - Campo `isActive: Boolean` en todas las entidades
   - Filtrado automático en servicios
   - Endpoints separados para archivos

5. **JWT Authentication**
   - Tokens con 10 horas de validez
   - Generación en `JwtUtil`
   - Validación en controladores protegidos

6. **Microservices Architecture**
   - Backend (Spring Boot) actúa como orquestador
   - AI Service (FastAPI Python) especializado en reconocimiento facial
   - Comunicación via REST HTTP entre servicios
   - Cada servicio responsable de su dominio
   - Permite equipos independientes y escalabilidad

### AI Service

1. **Computer Vision Pipeline**
   - Carga de imágenes desde base64
   - Conversión de formato RGB ↔ BGR (OpenCV)
   - Extracción de encodings faciales (dlib)
   - Comparación de similitud
   - Umbral configurable de tolerancia

2. **Request-Response Pattern**
   - Modelos Pydantic para validación
   - Respuestas JSON estructuradas
   - Manejo de errores HTTP estándar

3. **Image Management**
   - Almacenamiento de rostros registrados por employee_id
   - Log de intentos fallidos con timestamp
   - Directories configurables para organización

### Frontend

1. **Component-Based Architecture**
   - Componentes funcionales con hooks
   - Componentes globales reutilizables
   - Componentes de página específicos

2. **Protected Routes**
   - `ProtectedRoute` component
   - `useProtected()` hook para validación
   - Redirección automática a login

3. **HTTP Client Pattern**
   - `api.ts` como cliente centralizado
   - Interceptores para JWT y errores
   - Manejo automático de 401/403

4. **Custom Hooks**
   - `useAuth()`: Estado de autenticación
   - `useProtected()`: Validación de rutas

5. **Responsive Design**
   - Mobile-first con Tailwind
   - Breakpoints: sm, md, lg, xl

---

## Flujos Principales

### Autenticación
```
1. Usuario inicia sesión en LoginPage
2. Envía credentials a POST /auth/admin/login
3. Backend genera JWT token
4. Frontend almacena en localStorage
5. Token incluido en todas las peticiones como Authorization header
6. Validación en JwtUtil antes de operaciones protegidas
```

### Acceso al ROOM_911
```
1. Empleado intenta acceso con PIN
2. POST /auth/employee/access valida PIN
3. AccessLog registra el intento (exitoso o denegado)
4. Dashboard y AccessLogsPage muestran en tiempo real
5. Reportes agregan datos por período
```

### CRUD de Empleados
```
1. Admin accede a EmployeesPage
2. Visualiza tabla de empleados activos
3. Puede crear, editar, soft-delete
4. CSV import para bulk upload
5. ArchivedItemsPage muestra eliminados
6. Opción de restore o eliminar permanentemente
```

### Reconocimiento Facial y 2FA
```
1. Admin registra rostro del empleado
   - Captura foto en EmployeesPage
   - Envía base64 a POST /ai-service/register-face
   - Python extrae encoding facial
   - Guarda rostro en faces/{employee_id}.jpg

2. Empleado intenta acceso al ROOM_911
   - Room911Page captura foto con cámara
   - Envía PIN + foto base64

3. Backend valida flujo:
   - Verifica PIN correcto vía internal_id
   - Envía foto a POST /ai-service/verify-face (employee_id, image_base64)
   - Python compara con rostro registrado
   - Retorna: {match: boolean, confidence: float}

4. Resultado:
   - Si coincide (match=true): Acceso permitido
   - Si no coincide: Se guarda intento fallido en failed_attempts/
   - AccessLog registra: employee_id, timestamp, biometric_status
   - Dashboard muestra en tiempo real

5. Gestión:
   - Admin puede ver estadísticas en /ai-service/stats
   - Puede eliminar rostro con DELETE /ai-service/faces/{employee_id}
   - Logs de intentos fallidos disponibles para auditoría
```

---

## Configuración de Ambiente

### Backend
- **Puerto**: 8080
- **API Context**: `/api`
- **Database**: PostgreSQL (localhost:5432)
- **Credenciales**: Configuradas en `application.yml`

### Frontend
- **Puerto**: 5173 (Vite dev server)
- **Proxy API**: `/api/*` → `http://localhost:8080/api`
- **Build Output**: `dist/` directory

### AI Service (Python)
- **Puerto**: 8001
- **Base URL**: `http://localhost:8001`
- **Endpoints**:
  - `GET /health` — Health check
  - `POST /register-face` — Registrar rostro de empleado
  - `POST /verify-face` — Verificar rostro (autenticación)
  - `POST /verify-face-file` — Verificar rostro desde archivo
  - `GET /faces/{employee_id}` — Estado del registro facial
  - `DELETE /faces/{employee_id}` — Eliminar rostro registrado
  - `GET /stats` — Estadísticas del servicio
- **Variables de entorno** (`config.py`):
  - `FACES_DIR` — Directorio de almacenamiento de rostros
  - `FAILED_ATTEMPTS_DIR` — Directorio de intentos fallidos
  - `FACE_RECOGNITION_CONFIG["tolerance"]` — Umbral de similitud (default: 0.6)
  - `FACE_RECOGNITION_CONFIG["model"]` — Modelo dlib (default: "hog")

---

## Consideraciones de Seguridad

✅ **Implementado:**
- JWT authentication con validación
- CORS configurado
- Soft deletes (no pérdida de datos)
- Contraseñas hasheadas con Spring Security
- Protección de rutas en frontend y backend
- Almacenamiento seguro de datos biométricos (locales en ai-service)
- Log de intentos fallidos para auditoría

⚠️ **Para Producción:**
- Externalizar credenciales a variables de entorno
- Configurar CORS específicamente (no `*`)
- Implementar rate limiting
- Usar HTTPS
- Rotar secretos JWT regularmente
- Agregar audit logging
- **Biometría**: Encriptación de datos biométricos en reposo
- **AI Service**: Proteger endpoints con API keys o JWT
- **Imágenes**: Implementar garbage collection para failed_attempts
- **Privacidad**: Cumplir con GDPR/leyes locales en almacenamiento facial
- **Comunicación**: Usar HTTPS entre backend y AI Service

---

## Notas para Desarrollo Futuro

### Backend
- **Tests**: No configurados aún; usar `mvn test` cuando se agreguen
- **Paginación**: Considerar agregar `Pageable` a endpoints de listado
- **Caché**: Implementar Redis para datos frecuentes
- **Eventos**: Listener de eventos para auditoría
- **Validación**: Agregar anotaciones `@Valid` para DTOs
- **Documentación API**: Swagger/SpringDoc para OpenAPI
- **Integración Facial**: Agregar campo `facialVerificationPassed` a AccessLog entity
- **Orquestación**: Implementar retry logic y circuit breaker para llamadas al AI Service

### AI Service
- **Tests**: Tests básicos en `test_service.py`; expandir cobertura
- **Logging**: Implementar logging estructurado (actualmente solo `print`)
- **Persistencia**: Considerar agregar base de datos para metadatos de rostros
- **Modelos Alternativos**: Evaluar "cnn" vs "hog" para mejor precisión en diferentes escenarios
- **Escalabilidad**: GPU support para acelerar extracción de encodings
- **Autenticación**: Agregar API keys o JWT para proteger endpoints
- **Umbrales Dinámicos**: Permitir ajuste de tolerancia por empleado
- **Validación Facial**: Detección de intentos con fotos/máscaras vs rostros vivos

### Observabilidad
- **Monitoreo**: Métricas en ambos servicios (latencia, accuracy, falsos positivos)
- **Trazabilidad**: Correlation IDs entre backend y AI Service
- **Alertas**: Anomalías en tasas de rechazo o intentos fallidos
