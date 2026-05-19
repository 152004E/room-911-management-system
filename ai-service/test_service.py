#!/usr/bin/env python3
"""
Script de prueba para verificar que el servicio de reconocimiento facial funciona.
Ejecuta: python test_service.py
"""

import requests
import sys
from typing import Optional

BASE_URL = "http://localhost:8001"


def test_health() -> bool:
    """Test 1: Verificar que servicio está vivo"""
    print("\n🔍 Test 1: Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ Servicio activo")
            print(f"     Status: {data['status']}")
            print(f"     Service: {data['service']}")
            print(f"     Version: {data['version']}")
            return True
        else:
            print(f"  ❌ Respuesta inesperada: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"  ❌ No se puede conectar a {BASE_URL}")
        print(f"     ¿Servicio iniciado? python main.py")
        return False
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False


def test_stats() -> bool:
    """Test 2: Ver estadísticas"""
    print("\n📊 Test 2: Estadísticas...")
    try:
        response = requests.get(f"{BASE_URL}/stats", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"  ✅ Estadísticas obtenidas")
            print(f"     Rostros registrados: {data['registered_faces']}")
            print(f"     Intentos fallidos: {data['failed_attempts']}")
            print(f"     Tolerancia: {data['tolerance']}")
            print(f"     Modelo: {data['model']}")
            return True
        return False
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False


def test_face_status(employee_id: int = 1) -> bool:
    """Test 3: Verificar estado de rostro registrado"""
    print(f"\n👤 Test 3: Estado de rostro (empleado {employee_id})...")
    try:
        response = requests.get(f"{BASE_URL}/faces/{employee_id}", timeout=5)
        if response.status_code == 200:
            data = response.json()
            status = "SÍ" if data['registered'] else "NO"
            print(f"  ✅ Estado obtenido")
            print(f"     ¿Registrado?: {status}")
            print(f"     Mensaje: {data['message']}")
            return True
        return False
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False


def test_integration_ready() -> None:
    """Verificar que todo está listo para integración"""
    print("\n🚀 Verificación de integración con Spring Boot...")
    print("\n  Checklist:")
    print("  [ ] POST   /register-face        - Registrar rostro de empleado")
    print("  [ ] POST   /verify-face          - Verificar rostro enviado")
    print("  [ ] GET    /faces/{employee_id}  - Verificar si está registrado")
    print("  [ ] DELETE /faces/{employee_id}  - Eliminar rostro registrado")
    print("  [ ] GET    /stats                - Ver estadísticas")
    print("\n  Todos los endpoints están disponibles en:")
    print(f"  📘 {BASE_URL}/docs (Swagger UI)")
    print(f"  📗 {BASE_URL}/redoc (ReDoc)")


def main():
    """Ejecutar todos los tests"""
    print("=" * 60)
    print("ROOM_911 Facial Recognition Service - Test Suite")
    print("=" * 60)

    results = []

    # Test 1: Health
    results.append(("Health Check", test_health()))

    if results[-1][1]:  # Solo continuar si health check pasó
        # Test 2: Stats
        results.append(("Statistics", test_stats()))

        # Test 3: Face Status
        results.append(("Face Status", test_face_status()))

        # Verificar integración
        test_integration_ready()

    # Resumen final
    print("\n" + "=" * 60)
    print("RESUMEN DE TESTS")
    print("=" * 60)

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")

    print("\n" + "-" * 60)
    print(f"Resultado: {passed}/{total} tests pasados")

    if passed == total:
        print("\n✨ ¡Servicio listo para usar!")
        print("\nPróximos pasos:")
        print("  1. Registrar rostros de empleados")
        print("  2. Verificar que coincidan correctamente")
        print("  3. Integrar con Spring Boot en /auth/employee/access")
        return 0
    else:
        print("\n⚠️  Algunos tests fallaron")
        print("\nSolucionar:")
        print("  1. Verificar que el servicio está en ejecución")
        print("  2. Revisar logs del servicio")
        print("  3. Consultar README.md para troubleshooting")
        return 1


if __name__ == "__main__":
    sys.exit(main())
