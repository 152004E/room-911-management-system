# Quick Start - ROOM_911 Facial Recognition

Guía rápida para iniciar el servicio de reconocimiento facial.

## 1. Instalar dependencias (primera vez)

```bash
cd ai-service

# Windows
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 2. Iniciar servicio

```bash
python main.py
```

Verás:
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete
```

## 3. Verificar que funciona

Abre en navegador:
```
http://localhost:8001/docs
```

Deberías ver Swagger UI con todos los endpoints.

O prueba:
```bash
curl http://localhost:8001/health
```

Respuesta:
```json
{
  "status": "healthy",
  "service": "ROOM_911 Facial Recognition",
  "version": "1.0.0"
}
```

## 4. Registrar primer rostro

### Opción A: Con imagen real

1. Toma una foto clara del empleado (formato JPG)
2. Guárdala como `test_photo.jpg` en la carpeta ai-service
3. Abre el archivo `test_registration.py` (crealo si no existe)

```python
import requests
import base64

with open("test_photo.jpg", "rb") as f:
    image_data = base64.b64encode(f.read()).decode()

response = requests.post(
    "http://localhost:8001/register-face",
    data={
        "employee_id": 1,
        "image_base64": image_data
    }
)

print(response.json())
```

4. Ejecuta:
```bash
python test_registration.py
```

### Opción B: Usando Swagger UI

1. Ve a http://localhost:8001/docs
2. Abre POST `/register-face`
3. Click "Try it out"
4. Completa:
   - employee_id: `1`
   - image_base64: Copia el base64 de tu foto
5. Ejecuta

## 5. Verificar rostro

Después de registrar, prueba:

```python
import requests
import base64

# Usa la misma foto o una similar
with open("test_photo.jpg", "rb") as f:
    image_data = base64.b64encode(f.read()).decode()

response = requests.post(
    "http://localhost:8001/verify-face",
    data={
        "employee_id": 1,
        "image_base64": image_data
    }
)

result = response.json()
print(f"¿Rostro coincide?: {result['match']}")
print(f"Confianza: {result['confidence']:.2%}")
```

Esperado:
```
¿Rostro coincide?: True
Confianza: 95.23%
```

## Troubleshooting

### "No face detected in image"
- Asegúrate que el rostro sea visible y clara
- Evita gafas de sol o accesorios que oculten el rostro
- Prueba con mejor iluminación

### "ModuleNotFoundError: face_recognition"
```bash
# Reinstala dependencias
pip install -r requirements.txt --upgrade
```

### Puerto 8001 ya está en uso
```bash
# Cambiar puerto en config.py
AI_SERVICE_PORT = 8002
```

### En Windows: Error al compilar face_recognition
Necesitas Visual Studio Build Tools. Descárgalo desde:
https://visualstudio.microsoft.com/visual-cpp-build-tools/

## Próximo: Integrar con Spring Boot

Ver: [Backend Integration Guide](../backend/docs/FACIAL_RECOGNITION_INTEGRATION.md)

## Ver documentación completa

```bash
cat README.md
```

---

¡Listo! Tu servicio de reconocimiento facial está corriendo. 🎉
