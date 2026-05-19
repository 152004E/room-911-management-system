import os
from pathlib import Path

# Directorios base
BASE_DIR = Path(__file__).parent
FACES_DIR = BASE_DIR / "faces"
FAILED_ATTEMPTS_DIR = BASE_DIR / "failed_attempts"

# Crear directorios si no existen
FACES_DIR.mkdir(exist_ok=True)
FAILED_ATTEMPTS_DIR.mkdir(exist_ok=True)

# Configuración de reconocimiento facial
FACE_RECOGNITION_CONFIG = {
    "model": "cnn",  # "cnn" es más preciso pero lento, "hog" es rápido pero menos preciso
    "tolerance": 0.6,  # Tolerancia de similitud (0.0 - 1.0). Menor = más estricto
}

# Puerto del servicio
AI_SERVICE_PORT = int(os.getenv("AI_SERVICE_PORT", 8001))
AI_SERVICE_HOST = os.getenv("AI_SERVICE_HOST", "0.0.0.0")

# URL del backend Spring
SPRING_BOOT_URL = os.getenv("SPRING_BOOT_URL", "http://localhost:8080")

# Límites de tamaño
MAX_IMAGE_SIZE_MB = 10
ALLOWED_IMAGE_FORMATS = {"jpg", "jpeg", "png", "gif"}

# Logging
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
