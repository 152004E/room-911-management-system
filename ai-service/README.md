# ROOM_911 Facial Recognition AI Service

Microservicio Python para reconocimiento facial biométrico integrado con ROOM_911 Management System.

## Características

✅ Verificación facial de empleados
✅ Registro de nuevos rostros
✅ Detección de intentos fallidos
✅ Estadísticas de uso
✅ API REST con FastAPI
✅ Sin dependencias de aprendizaje profundo complejo

## Requisitos

- Python 3.8+
- pip (gestor de paquetes)

## Instalación

### 1. Crear entorno virtual

```bash
cd ai-service
python -m venv venv

# En Windows:
venv\Scripts\activate

# En Linux/Mac:
source venv/bin/activate
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

⚠️ **Nota**: La instalación de `face_recognition` requiere compilación. En Windows puede necesitar Visual Studio Build Tools.

### 3. Iniciar servicio

```bash
python main.py
```

El servicio estará disponible en: **http://localhost:8001**

Documentación interactiva: **http://localhost:8001/docs**

## Estructura

```
ai-service/
├── main.py              # Aplicación FastAPI principal
├── config.py            # Configuración y constantes
├── requirements.txt     # Dependencias Python
├── faces/               # Imágenes registradas de empleados (employee_id.jpg)
├── failed_attempts/     # Intentos de acceso fallidos
└── README.md           # Este archivo
```

## API Endpoints

### 1. Health Check

```http
GET /health
```

**Respuesta:**
```json
{
  "status": "healthy",
  "service": "ROOM_911 Facial Recognition",
  "version": "1.0.0"
}
```

---

### 2. Registrar Rostro

```http
POST /register-face
Content-Type: multipart/form-data

employee_id: 1
image_base64: "base64_encoded_image_data..."
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Face registered successfully for employee 1",
  "employee_id": 1
}
```

**Errores posibles:**
- 400: Sin rostro detectado en imagen
- 400: Formato de imagen inválido
- 500: Error al guardar imagen

---

### 3. Verificar Rostro

```http
POST /verify-face
Content-Type: multipart/form-data

employee_id: 1
image_base64: "base64_encoded_image_data..."
```

**Respuesta (200):**
```json
{
  "match": true,
  "confidence": 0.95,
  "message": "Face match successful"
}
```

**Parámetros de respuesta:**
- `match`: true si el rostro coincide con el registrado
- `confidence`: Similitud (0.0 - 1.0). Mayor = más similar
- `message`: Descripción del resultado

**Errores posibles:**
- 404: No existe rostro registrado para el empleado
- 400: Sin rostro detectado en imagen enviada
- 400: Formato de imagen inválido

---

### 4. Verificar Rostro (Archivo)

```http
POST /verify-face-file
Content-Type: multipart/form-data

employee_id: 1
file: <binary_image_file>
```

Igual que `/verify-face` pero recibe archivo en lugar de base64.

---

### 5. Verificar Estado de Rostro

```http
GET /faces/{employee_id}
```

**Respuesta:**
```json
{
  "employee_id": 1,
  "registered": true,
  "message": "Face registered"
}
```

---

### 6. Eliminar Rostro

```http
DELETE /faces/{employee_id}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Face deleted for employee 1"
}
```

---

### 7. Estadísticas

```http
GET /stats
```

**Respuesta:**
```json
{
  "registered_faces": 15,
  "failed_attempts": 3,
  "tolerance": 0.6,
  "model": "cnn"
}
```

---

## Flujo de Integración con Spring Boot

### 1. Empleado se registra

**Request Backend → AI Service:**
```
POST /register-face
body: {
  "employee_id": 1,
  "image_base64": "..."
}
```

La imagen se guarda en `ai-service/faces/1.jpg`

### 2. Empleado intenta acceso

**Frontend captura cámara:**
```javascript
// React component
const canvas = canvasRef.current;
const imageData = canvas.toDataURL('image/jpeg');
const base64 = imageData.split(',')[1];

// Envía a Backend
await api.post('/auth/employee/access', {
  internalId: "PIN123",
  faceImage: base64
});
```

**Backend procesa:**
```java
// Spring Boot
1. Valida PIN (internalId)
2. Si válido → Envía a AI Service
3. AI Service compara rostro
4. Backend registra AccessLog con resultado facial
```

**Backend → AI Service:**
```
POST /verify-face
body: {
  "employee_id": 1,
  "image_base64": "..."
}
```

**Respuesta AI:**
```json
{
  "match": true,
  "confidence": 0.92
}
```

**Backend registra en AccessLog:**
```json
{
  "employeeId": 1,
  "internalId": "PIN123",
  "accessTimestamp": "2025-01-15T10:30:00",
  "isSuccessful": true,
  "facialVerificationPassed": true,
  "reasonDenied": null
}
```

---

## Configuración

Edita `config.py` para ajustar:

```python
# Tolerancia de similitud (0.0 - 1.0)
# Menor = más estricto = menos falsos positivos
"tolerance": 0.6,

# Modelo de detección
# "cnn" = más preciso pero lento
# "hog" = rápido pero menos preciso
"model": "cnn",

# Puerto del servicio
AI_SERVICE_PORT = 8001

# URL del backend Spring
SPRING_BOOT_URL = "http://localhost:8080"
```

---

## Ejemplos de Uso

### Python - Registrar rostro

```python
import requests
import base64

# Leer imagen
with open("employee_photo.jpg", "rb") as f:
    image_data = base64.b64encode(f.read()).decode()

# Registrar
response = requests.post(
    "http://localhost:8001/register-face",
    data={
        "employee_id": 1,
        "image_base64": image_data
    }
)

print(response.json())
# { "success": true, "message": "Face registered successfully..." }
```

### Python - Verificar rostro

```python
import requests
import base64

# Leer imagen a verificar
with open("test_photo.jpg", "rb") as f:
    image_data = base64.b64encode(f.read()).decode()

# Verificar
response = requests.post(
    "http://localhost:8001/verify-face",
    data={
        "employee_id": 1,
        "image_base64": image_data
    }
)

result = response.json()
print(f"Match: {result['match']}")  # True/False
print(f"Confidence: {result['confidence']}")  # 0.0 - 1.0
```

### JavaScript/React - Capturar cámara

```javascript
import { useRef } from 'react';

export function FaceCapture({ employeeId }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Iniciar cámara
  async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 }
    });
    videoRef.current.srcObject = stream;
  }

  // Capturar frame
  function captureFrame() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    // Convertir a base64
    const imageBase64 = canvas
      .toDataURL('image/jpeg')
      .split(',')[1];

    return imageBase64;
  }

  // Verificar rostro
  async function verifyFace() {
    const imageBase64 = captureFrame();

    const response = await fetch('/api/verify-face', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_id: employeeId,
        image_base64: imageBase64
      })
    });

    const result = await response.json();
    console.log(`Match: ${result.match}, Confidence: ${result.confidence}`);
  }

  return (
    <div>
      <video ref={videoRef} autoPlay></video>
      <canvas ref={canvasRef} hidden></canvas>
      <button onClick={startCamera}>Activar cámara</button>
      <button onClick={verifyFace}>Verificar rostro</button>
    </div>
  );
}
```

---

## Estructura de Carpetas de Datos

```
ai-service/
├── faces/
│   ├── 1.jpg         # Rostro registrado de empleado 1
│   ├── 2.jpg         # Rostro registrado de empleado 2
│   └── 3.jpg         # Rostro registrado de empleado 3
│
└── failed_attempts/
    ├── employee_1_20250115_093000.jpg
    ├── employee_1_20250115_093030.jpg
    └── employee_2_20250115_100000.jpg
```

### Notas:
- Cada empleado tiene un archivo: `{employee_id}.jpg`
- Intentos fallidos se guardan como: `employee_{id}_{timestamp}.jpg`
- Esto permite auditoría y análisis de intentos no autorizados

---

## Monitoreo y Troubleshooting

### Verificar servicio activo

```bash
curl http://localhost:8001/health
```

### Ver estadísticas

```bash
curl http://localhost:8001/stats
```

Salida:
```json
{
  "registered_faces": 5,
  "failed_attempts": 2,
  "tolerance": 0.6,
  "model": "cnn"
}
```

### Errores comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `No face detected in image` | Imagen borrosa o sin rostro visible | Capturar nueva imagen con mejor iluminación |
| `Failed to load registered face` | Archivo corrompido en `faces/` | Re-registrar el rostro del empleado |
| `tolerance` muy alto | Muchos falsos positivos | Reducir `tolerance` en config.py |
| `tolerance` muy bajo | Muchos falsos negativos | Aumentar `tolerance` en config.py |

---

## Próximas Mejoras

- [ ] Detección de vivacidad (liveness detection) para evitar fotos
- [ ] Soporte para múltiples rostros por empleado
- [ ] Almacenamiento en base de datos en lugar de archivos
- [ ] Integración con especificación de temperatura
- [ ] Alertas en tiempo real a administrador
- [ ] Dashboard de intentos fallidos
- [ ] Análisis de confianza por rango horario

---

## Licencia

Parte del sistema ROOM_911 Management System.

## Soporte

Para reportar issues o sugerencias, contactar al equipo de desarrollo.
