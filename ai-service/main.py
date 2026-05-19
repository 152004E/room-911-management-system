import os
import io
import base64
from datetime import datetime
from pathlib import Path
from typing import Optional

import cv2
import numpy as np
import face_recognition
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

import config

app = FastAPI(
    title="ROOM_911 Facial Recognition Service",
    description="Microservicio de reconocimiento facial para ROOM_911 Management System",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Modelos Pydantic
# ─────────────────────────────────────────────────────────────────────────────

class FaceVerificationRequest(BaseModel):
    employee_id: int
    image_base64: str


class FaceVerificationResponse(BaseModel):
    match: bool
    confidence: float
    message: str


class FaceRegistrationResponse(BaseModel):
    success: bool
    message: str
    employee_id: int


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


# ─────────────────────────────────────────────────────────────────────────────
# Utilidades
# ─────────────────────────────────────────────────────────────────────────────

def load_image_from_base64(image_base64: str) -> Optional[np.ndarray]:
    """Convierte imagen base64 a array numpy para procesamiento"""
    try:
        image_data = base64.b64decode(image_base64)
        image = Image.open(io.BytesIO(image_data))
        image_array = np.array(image)

        # Convertir RGB a BGR si es necesario (OpenCV usa BGR)
        if len(image_array.shape) == 3 and image_array.shape[2] == 3:
            image_array = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)

        return image_array
    except Exception as e:
        print(f"Error loading image from base64: {str(e)}")
        return None


def save_image_to_file(image_array: np.ndarray, filename: str, directory: Path) -> str:
    """Guarda imagen en archivo"""
    try:
        directory.mkdir(parents=True, exist_ok=True)
        filepath = directory / filename
        cv2.imwrite(str(filepath), image_array)
        return str(filepath)
    except Exception as e:
        print(f"Error saving image: {str(e)}")
        return ""


def get_face_encodings(image_array: np.ndarray) -> list:
    """Extrae encodings faciales de una imagen"""
    try:
        encodings = face_recognition.face_encodings(
            image_array,
            model=config.FACE_RECOGNITION_CONFIG["model"]
        )
        return encodings
    except Exception as e:
        print(f"Error extracting face encodings: {str(e)}")
        return []


def compare_faces(known_encoding: np.ndarray, unknown_encoding: np.ndarray) -> tuple[bool, float]:
    """Compara dos encodings faciales y retorna similitud"""
    try:
        results = face_recognition.compare_faces(
            [known_encoding],
            unknown_encoding,
            tolerance=config.FACE_RECOGNITION_CONFIG["tolerance"]
        )

        distances = face_recognition.face_distance(
            [known_encoding],
            unknown_encoding
        )

        match = results[0] if results else False
        confidence = float(1 - distances[0]) if distances.size > 0 else 0.0

        return match, confidence
    except Exception as e:
        print(f"Error comparing faces: {str(e)}")
        return False, 0.0


def face_file_exists(employee_id: int) -> bool:
    """Verifica si existe archivo de rostro registrado para empleado"""
    face_path = config.FACES_DIR / f"{employee_id}.jpg"
    return face_path.exists()


# ─────────────────────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check del servicio"""
    return HealthResponse(
        status="healthy",
        service="ROOM_911 Facial Recognition",
        version="1.0.0"
    )


@app.post("/verify-face", response_model=FaceVerificationResponse)
async def verify_face(
    employee_id: int = Form(...),
    image_base64: str = Form(...)
) -> FaceVerificationResponse:
    """
    Verifica si el rostro en la imagen coincide con el rostro registrado del empleado.

    Parámetros:
    - employee_id: ID del empleado
    - image_base64: Imagen en formato base64

    Retorna:
    - match: True si coincide, False si no
    - confidence: Confianza de la coincidencia (0.0 - 1.0)
    """

    # Validar que existe rostro registrado
    if not face_file_exists(employee_id):
        raise HTTPException(
            status_code=404,
            detail=f"No face registered for employee {employee_id}"
        )

    # Cargar imagen enviada
    unknown_image = load_image_from_base64(image_base64)
    if unknown_image is None:
        raise HTTPException(status_code=400, detail="Invalid image format")

    # Extraer encodings de imagen enviada
    unknown_encodings = get_face_encodings(unknown_image)
    if not unknown_encodings:
        raise HTTPException(
            status_code=400,
            detail="No face detected in provided image"
        )

    # Cargar imagen registrada
    registered_image_path = config.FACES_DIR / f"{employee_id}.jpg"
    try:
        registered_image = cv2.imread(str(registered_image_path))
        if registered_image is None:
            raise HTTPException(status_code=500, detail="Failed to load registered face")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading registered face: {str(e)}")

    # Extraer encodings de imagen registrada
    registered_encodings = get_face_encodings(registered_image)
    if not registered_encodings:
        raise HTTPException(
            status_code=500,
            detail="Could not extract face from registered image"
        )

    # Comparar rostros
    known_encoding = registered_encodings[0]
    unknown_encoding = unknown_encodings[0]
    match, confidence = compare_faces(known_encoding, unknown_encoding)

    # Si no coincide, guardar intento fallido
    if not match:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"employee_{employee_id}_{timestamp}.jpg"
        save_image_to_file(unknown_image, filename, config.FAILED_ATTEMPTS_DIR)

    return FaceVerificationResponse(
        match=match,
        confidence=confidence,
        message="Face match successful" if match else "Face does not match"
    )


@app.post("/register-face", response_model=FaceRegistrationResponse)
async def register_face(
    employee_id: int = Form(...),
    image_base64: str = Form(...)
) -> FaceRegistrationResponse:
    """
    Registra el rostro de un empleado.

    Parámetros:
    - employee_id: ID del empleado
    - image_base64: Imagen frontal del rostro en base64

    Retorna:
    - success: True si se registró correctamente
    """

    # Cargar imagen
    image = load_image_from_base64(image_base64)
    if image is None:
        raise HTTPException(status_code=400, detail="Invalid image format")

    # Validar que se puede extraer rostro
    encodings = get_face_encodings(image)
    if not encodings:
        raise HTTPException(
            status_code=400,
            detail="No face detected in image"
        )

    # Guardar imagen
    filename = f"{employee_id}.jpg"
    filepath = save_image_to_file(image, filename, config.FACES_DIR)

    if not filepath:
        raise HTTPException(
            status_code=500,
            detail="Failed to save face image"
        )

    return FaceRegistrationResponse(
        success=True,
        message=f"Face registered successfully for employee {employee_id}",
        employee_id=employee_id
    )


@app.post("/verify-face-file")
async def verify_face_file(
    employee_id: int = Form(...),
    file: UploadFile = File(...)
) -> FaceVerificationResponse:
    """
    Verifica rostro enviado como archivo (no base64).

    Parámetros:
    - employee_id: ID del empleado
    - file: Archivo de imagen

    Retorna:
    - match: True si coincide, False si no
    - confidence: Confianza de la coincidencia
    """

    # Validar que existe rostro registrado
    if not face_file_exists(employee_id):
        raise HTTPException(
            status_code=404,
            detail=f"No face registered for employee {employee_id}"
        )

    # Leer archivo
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        unknown_image = np.array(image)
        if len(unknown_image.shape) == 3 and unknown_image.shape[2] == 3:
            unknown_image = cv2.cvtColor(unknown_image, cv2.COLOR_RGB2BGR)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")

    # Extraer encodings
    unknown_encodings = get_face_encodings(unknown_image)
    if not unknown_encodings:
        raise HTTPException(status_code=400, detail="No face detected in image")

    # Cargar imagen registrada
    registered_image_path = config.FACES_DIR / f"{employee_id}.jpg"
    try:
        registered_image = cv2.imread(str(registered_image_path))
        if registered_image is None:
            raise HTTPException(status_code=500, detail="Failed to load registered face")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading registered face: {str(e)}")

    # Extraer encodings
    registered_encodings = get_face_encodings(registered_image)
    if not registered_encodings:
        raise HTTPException(status_code=500, detail="Could not extract face from registered image")

    # Comparar
    match, confidence = compare_faces(registered_encodings[0], unknown_encodings[0])

    if not match:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"employee_{employee_id}_{timestamp}.jpg"
        save_image_to_file(unknown_image, filename, config.FAILED_ATTEMPTS_DIR)

    return FaceVerificationResponse(
        match=match,
        confidence=confidence,
        message="Face match successful" if match else "Face does not match"
    )


@app.get("/faces/{employee_id}")
async def get_face_status(employee_id: int):
    """
    Verifica si existe rostro registrado para un empleado.

    Retorna:
    - registered: True si existe, False si no
    """
    exists = face_file_exists(employee_id)
    return {
        "employee_id": employee_id,
        "registered": exists,
        "message": "Face registered" if exists else "No face registered"
    }


@app.delete("/faces/{employee_id}")
async def delete_face(employee_id: int):
    """
    Elimina el rostro registrado de un empleado.
    """
    face_path = config.FACES_DIR / f"{employee_id}.jpg"

    if not face_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"No face found for employee {employee_id}"
        )

    try:
        os.remove(face_path)
        return {
            "success": True,
            "message": f"Face deleted for employee {employee_id}"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting face: {str(e)}"
        )


@app.get("/stats")
async def get_stats():
    """
    Retorna estadísticas del servicio.
    """
    registered_faces = len(list(config.FACES_DIR.glob("*.jpg")))
    failed_attempts = len(list(config.FAILED_ATTEMPTS_DIR.glob("*.jpg")))

    return {
        "registered_faces": registered_faces,
        "failed_attempts": failed_attempts,
        "tolerance": config.FACE_RECOGNITION_CONFIG["tolerance"],
        "model": config.FACE_RECOGNITION_CONFIG["model"]
    }


# ─────────────────────────────────────────────────────────────────────────────
# Punto de entrada
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=config.AI_SERVICE_HOST,
        port=config.AI_SERVICE_PORT,
        reload=True,
        log_level=config.LOG_LEVEL.lower()
    )
