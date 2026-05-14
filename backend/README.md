# ROOM 911 Management System - Backend

Backend API construido con Spring Boot 3.x, Java 21 y PostgreSQL.

## 📁 Estructura

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/room911/
│   │   │   ├── Room911Application.java          # Clase principal
│   │   │   ├── controller/                      # Controladores REST
│   │   │   ├── service/                         # Lógica de negocio
│   │   │   ├── repository/                      # Acceso a datos (JPA)
│   │   │   ├── entity/                          # Entidades JPA
│   │   │   ├── dto/                             # Data Transfer Objects
│   │   │   └── config/                          # Configuración Spring
│   │   └── resources/
│   │       └── application.yml                  # Configuración aplicación
│   └── test/
│       └── java/
├── pom.xml                                      # Dependencias Maven
└── README.md                                    # Este archivo
```

## 🚀 Compilar y Ejecutar

```bash
# Compilar e instalar dependencias
mvn clean install

# Ejecutar servidor de desarrollo (con hot reload)
mvn spring-boot:run

# Ejecutar tests
mvn test

# Empaquetar para producción
mvn package
```

## 🔌 API Endpoints

### Health Check
- **GET** `/api/health` - Verificar estado del servidor

Respuesta:
```json
{
  "status": "UP",
  "message": "ROOM 911 Management System is running"
}
```

## 🗄️ Base de Datos

Usa PostgreSQL con las siguientes configuraciones (en `application.yml`):

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/room911_db
    username: room911_user
    password: your_secure_password_here
  jpa:
    hibernate:
      ddl-auto: update
```

## 🔐 CORS

CORS está configurado para aceptar requests desde:
- `http://localhost:5173` (Frontend React)
- `http://localhost:3000` (Alternativa)

Ver: [Room911Application.java](src/main/java/com/room911/Room911Application.java#corsConfigurer)

## 📚 Dependencias Principales

- **Spring Boot 3.3.0** - Framework web
- **Spring Data JPA** - ORM e acceso a datos
- **PostgreSQL 42.7.2** - Driver de base de datos
- **Lombok** - Reduce boilerplate
- **Spring Validation** - Validación de datos
- **DevTools** - Hot reload en desarrollo

## 🧪 Testing

Tests unitarios y de integración en `src/test/java/`.

```bash
mvn test
```

## ⚙️ Configuración de Desarrollo

El archivo `application.yml` incluye:
- **Logging en DEBUG** para `com.room911` y `org.springframework.web`
- **DDL automático**: `update` (crea/actualiza tablas automáticamente)
- **SQL formateado** en logs de desarrollo

## 🔄 Hot Reload

Con `spring-boot-devtools`, los cambios en código se recargan automáticamente sin reiniciar el servidor.

```bash
mvn spring-boot:run
# Edita código → se recarga automáticamente
```

## 📝 Notas

- Java 21 LTS requerido
- PostgreSQL debe estar corriendo localmente
- Maven 3.9+ recomendado
- En desarrollo, ambos (backend + frontend) deben estar corriendo
