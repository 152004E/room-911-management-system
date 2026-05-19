# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

**ROOM 911 Management System** is a full-stack monorepo with:
- **Backend**: Spring Boot 3.5.14 (Java 21) REST API with PostgreSQL and JWT authentication
- **Frontend**: React 18 + Vite + TypeScript with Tailwind CSS and FontAwesome icons
- **Database**: PostgreSQL 14+ with Hibernate ORM (JPA)

### High-Level Design

**Backend Structure** (`backend/src/main/java/com/room911/`):
- `entity/` — JPA entities (Employee, Department, AdminUser, AccessLog)
- `repository/` — Spring Data JPA repositories with custom query methods
- `service/impl/` — Service implementations (business logic layer)
- `service/` — Service interfaces (define contracts)
- `controller/` — REST endpoints with `@RestController`
- `dto/` — Data Transfer Objects for request/response serialization
- `security/` — JWT token generation/validation (JwtUtil)
- `config/` — Spring configuration (currently minimal)

**Frontend Structure** (`frontend/src/`):
- `pages/admin/` — Admin dashboard pages (Employees, Departments, ArchivedItems)
- `pages/auth/` — Login and auth pages
- `components/` — Reusable UI components
- `services/api.ts` — HTTP client with fetch-based API wrapper
- `hooks/` — Custom React hooks (useAuth, useProtected)
- `layouts/` — Page layouts (SidebarLayout, etc.)



## Security & Safety Rules

Claude must NEVER:

- run `git push`
- run `git commit`
- run `git add .`
- publish code to remote repositories
- modify git remotes
- delete important files
- execute destructive terminal commands

Claude may only suggest git commands.

Always ask before:
- deleting files
- resetting branches
- overwriting configurations
- running dangerous commands

### Key Architectural Patterns

1. **Soft Deletes**: Entities have `isActive: Boolean` field instead of hard deletion. Services filter by `isActive = true` in find operations. Archived items accessed via separate `findDeleted()` endpoints.

2. **DTO Pattern**: Entities never returned directly from controllers. All responses use DTOs (e.g., EmployeeDTO, DepartmentDTO). Services contain `toDTO()` and `toEntity()` conversion methods.

3. **Service Layer**: Business logic lives in `Service` interface + `ServiceImpl`. Controllers call services, never repositories directly. This keeps concerns separated.

4. **JWT Authentication**: AdminUsers authenticated via JWT tokens (10-hour validity). Token passed in `Authorization: Bearer <token>` header. Frontend stores token in localStorage. Backend validates on protected endpoints via JwtUtil.

5. **Lazy Loading with JOIN FETCH**: Relationships use `FetchType.LAZY` to avoid N+1 queries. Custom repository methods use `@Query` with `JOIN FETCH` for eager loading when needed (e.g., `findByIdWithDepartment()`).

6. **CSV Bulk Import**: EmployeeCSVService parses files with OpenCSV. Validation includes required fields, duplicate detection, department existence, unique internal ID generation. Errors reported with row numbers.

---

## Development Commands

### Backend (Spring Boot + Maven)

```bash
cd backend

# Install dependencies and compile
mvn clean install

# Run dev server with hot reload (via spring-boot-devtools)
mvn spring-boot:run

# Run tests
mvn test

# Run specific test class
mvn test -Dtest=EmployeeServiceImplTest

# Package for deployment
mvn package

# Skip tests during package
mvn package -DskipTests
```

**Default backend port**: 8080  
**API context path**: `/api` (so endpoints are `/api/employees`, `/api/departments`, etc.)

### Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Run dev server with hot reload
npm run dev

# Type check (TypeScript)
npm run type-check

# Lint code (ESLint)
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

**Default frontend port**: 5173  
Vite proxy configured to forward `/api/*` → `http://localhost:8080/api`

### Database (PostgreSQL)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create user and database (one-time setup)
CREATE USER room911_user WITH PASSWORD 'secure_password';
CREATE DATABASE room_911 OWNER room911_user;

# Verify connection
psql -U room911_user -d room_911
```

**Connection details** (in `backend/src/main/resources/application.yml`):
- Host: localhost
- Port: 5432 (default)
- Database: room_911
- User: postgres (configured)
- Password: Room911123* (configured)

Note: Hibernate `ddl-auto: update` auto-creates/updates schema from entities at startup.

---

## Database and Entity Relationships

**Key Entities**:
- **Employee**: First/last name, email, phone, department, authorization status, soft-delete flag
- **Department**: Name, soft-delete flag; one-to-many with Employee
- **AdminUser**: Username/password for admins; stores hashed passwords (Spring Security)
- **AccessLog**: Tracks employee access attempts; linked to Employee

**Soft Delete Pattern**:
- All deletable entities have `isActive: Boolean NOT NULL`
- `@PrePersist` defaults `isActive = true`
- Service `findAll()` filters `isActive = true`
- Service `findDeleted()` filters `isActive = false`
- `deleteById()` sets `isActive = false` (soft delete)
- `deletePermanently()` calls `repository.deleteById()` (hard delete)
- `restoreById()` sets `isActive = true` (unarchive)

**Lazy Loading Strategy**:
- Entity relationships use `FetchType.LAZY` to avoid large eager-load chains
- Custom repository methods use `@Query` with `JOIN FETCH` when related data is needed (e.g., Employee.department)
- Controllers return DTOs, which include denormalized fields (e.g., `departmentName` on EmployeeDTO) to avoid N+1 queries

---

## API Endpoints (Backend)

### Employees
- `GET /employees` — List active employees
- `GET /employees/{id}` — Get by ID
- `GET /employees/internal/{internalId}` — Get by internal ID (security PIN)
- `POST /employees` — Create new employee
- `PUT /employees/{id}` — Update employee
- `DELETE /employees/{id}` — Soft delete (archive)
- `POST /employees/import-csv` — Bulk import from CSV file (multipart)
- `GET /employees/archived/list` — List archived employees
- `PUT /employees/{id}/restore` — Restore archived employee
- `DELETE /employees/{id}/permanent` — Hard delete archived employee

### Departments
- `GET /departments` — List active departments
- `GET /departments/{id}` — Get by ID
- `POST /departments` — Create new department
- `PUT /departments/{id}` — Update department
- `DELETE /departments/{id}` — Soft delete (archive)
- `GET /departments/archived/list` — List archived departments
- `PUT /departments/{id}/restore` — Restore archived department
- `DELETE /departments/{id}/permanent` — Hard delete archived department

### Admin Management
- `POST /auth/admin/login` — Admin login (returns JWT token)
- `POST /auth/admin/create` — Create admin user
- `GET /auth/admin/list` — List all admins
- `PUT /auth/admin/{id}` — Update admin
- `DELETE /auth/admin/{id}` — Soft delete admin

### Employee Access
- `POST /auth/employee/access` — Employee PIN-based access attempt

---

## Frontend Patterns

### API Client (`services/api.ts`)

```typescript
// For JSON requests (auto-stringified):
await api.post('/employees', { firstName: 'John', ... })
await api.put(`/employees/${id}`, employeeData)
await api.get('/employees')
await api.delete(`/employees/${id}`)

// For FormData (multipart) requests:
const formData = new FormData();
formData.append('file', csvFile);
await api.post('/employees/import-csv', formData); // No manual header needed
```

Client automatically:
- Adds `Content-Type: application/json` for JSON bodies (skipped for FormData)
- Adds `Authorization: Bearer <token>` if token exists in localStorage
- Handles 401/403 errors by redirecting to login
- Parses JSON responses; returns `{}` for 204 No Content

### Alert Notifications (`services/alerts.ts`)

```typescript
import { showAlert } from '../../services/alerts';

showAlert.success('Title', 'Success message')
showAlert.error('Title', 'Error message')
showAlert.warning('Title', 'Warning message')
```

Uses SweetAlert2. Integrate after successful operations or error responses.

### Protected Pages (useProtected Hook)
## Security & Safety Rules

Claude must NEVER:

- run `git push`
- run `git commit`
- run `git add .`
- publish code to remote repositories
- modify git remotes
- delete important files
- execute destructive terminal commands

Claude may only suggest git commands.

Always ask before:
- deleting files
- resetting branches
- overwriting configurations
- running dangerous commands

```typescript
// In page components:
const { isAuthenticated, isLoading } = useProtected();

if (isLoading) return <LoadingSpinner />;
if (!isAuthenticated) return null; // useProtected redirects if not auth
// Render page content
```

### Modal Pattern

Modals controlled by React state:
```typescript
const [showModal, setShowModal] = useState(false);

{showModal && (
  <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md ...">
    <form onSubmit={handleSubmit}>
      {/* Form content */}
    </form>
  </div>
)}
```

---

## Common Development Tasks

### Adding a New Entity and CRUD

1. Create entity in `backend/src/main/java/com/room911/entity/YourEntity.java` with `isActive` field and `@PrePersist`
2. Create DTO in `backend/.../dto/YourEntityDTO.java`
3. Create repository in `backend/.../repository/YourEntityRepository.java` (extend JpaRepository)
4. Create service interface in `backend/.../service/YourService.java`
5. Implement service in `backend/.../service/impl/YourServiceImpl.java` (include `findAll()`, `findDeleted()`, `save()`, `deleteById()`, `restoreById()`, `deletePermanently()`)
6. Create controller in `backend/.../controller/YourController.java` with endpoints
7. Add frontend page in `frontend/src/pages/admin/YourPage.tsx` with list, create, edit, delete, and archive tabs

### Adding a CSV Import Feature

1. Create DTO for CSV record (e.g., `EmployeeCSVRecord`) with fields matching CSV columns
2. Create CSV service with `parseCSV()` static method using OpenCSV
3. Add `importFromCSV(List<CsvRecordDTO>)` method to service
4. Add `POST /entity/import-csv` endpoint in controller with `@RequestParam("file") MultipartFile file`
5. Frontend: Create modal with file input, FormData builder, and `api.post(endpoint, formData)` (no manual headers)
6. Display import results (success count, error list with row numbers)

### Fixing Lazy Loading Issues

If you see `LazyInitializationException` on related entities:
1. In repository, create a custom query method with `JOIN FETCH`: e.g., `@Query("SELECT e FROM Employee e JOIN FETCH e.department WHERE e.id = ?1")`
2. In service, use refetch pattern after save: `repository.findByIdWithDepartment(id).orElse(entity)`
## Security & Safety Rules

Claude must NEVER:

- run `git push`
- run `git commit`
- run `git add .`
- publish code to remote repositories
- modify git remotes
- delete important files
- execute destructive terminal commands

Claude may only suggest git commands.

Always ask before:
- deleting files
- resetting branches
- overwriting configurations
- running dangerous commands
3. Return DTOs with denormalized fields (e.g., `departmentName` on EmployeeDTO) to avoid exposing LAZY relationships

### Debugging

**Backend**:
- Check logs in terminal running `mvn spring-boot:run` for Hibernate SQL and Spring Web logs
- Logging configured in `application.yml`: `com.room911` at DEBUG level
- Use `show-sql: true` in application.yml to see raw SQL queries

**Frontend**:
- Browser DevTools → Network tab to inspect API requests/responses
- Check browser console for React errors
- API responses logged to console via `console.error` in api.ts on errors

---

## Configuration

**Backend** (`application.yml`):
- Change server port via `server.port`
- Adjust database connection via `spring.datasource` (url, username, password)
- Toggle SQL logging via `hibernate.show_sql`

**Frontend** (Vite):
- Dev server port: `server.port` in `vite.config.ts`
- Proxy configuration for `/api`: Already set to forward to `http://localhost:8080`
- Environment variables: Prefix with `VITE_` in `.env` or `.env.local`, access via `import.meta.env.VITE_*`

**JWT Token**:
- Validity: 10 hours (configured in `JwtUtil.JWT_TOKEN_VALIDITY`)
- Secret key: Auto-generated HS256 key (should be externalized to config in production)

---

## Notes for Future Development

- **No test suite yet**: Tests not currently set up; use `mvn test` to run when tests are added
- **Security**: Passwords for AdminUser should use Spring Security's PasswordEncoder (currently might need implementation review)
- **CORS**: Configured for `*` origins in backend; tighten for production
- **Externalized Config**: Database credentials and JWT secret hardcoded in application.yml; move to environment variables or Spring Cloud Config
- **Error Handling**: Backend returns generic error messages; consider structured error responses with codes
- **Pagination**: List endpoints don't paginate; consider adding `Pageable` support as data grows

---
