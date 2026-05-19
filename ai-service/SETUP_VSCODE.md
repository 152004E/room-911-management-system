# Configuración de VS Code para AI Service

Los errores de "missing-import" que ves en VS Code no son errores reales del código. Ocurren porque el linter no puede encontrar las dependencias Python instaladas.

## Solución (Choose One)

### Opción 1: Configurar Python Interpreter (RECOMENDADO)

1. **Abre Command Palette** en VS Code:
   - Windows/Linux: `Ctrl + Shift + P`
   - Mac: `Cmd + Shift + P`

2. **Escribe**: `Python: Select Interpreter`

3. **Elige**: El interpreter del venv que creaste:
   ```
   ./ai-service/venv/bin/python
   ```

4. **Reinicia VS Code**: Presiona `Ctrl + Shift + P` → "Developer: Reload Window"

### Opción 2: Instalar dependencias globalmente

Si no quieres usar venv:

```bash
pip install fastapi uvicorn face-recognition opencv-python numpy pillow python-multipart pydantic requests
```

### Opción 3: Ignorar warnings (NO RECOMENDADO)

Si no necesitas que VS Code valide imports:

1. Abre `.vscode/settings.json`
2. Cambia: `"python.linting.enabled": false`

---

## Verificación

Después de configurar, los errores deben desaparecer. Si persisten:

1. **Verifica el interpreter**:
   - Abre terminal en VS Code
   - Ejecuta: `python --version`
   - Debe ser Python 3.8+

2. **Verifica que venv esté activado**:
   ```bash
   cd ai-service
   source venv/bin/activate  # Linux/Mac
   # o
   venv\Scripts\activate     # Windows
   pip list  # Debe mostrar fastapi, face_recognition, etc.
   ```

3. **Recarga VS Code**:
   - `Ctrl + Shift + P` → "Developer: Reload Window"

---

## El Código Funciona Sin Importes Configurados

Importante: Aunque VS Code muestre errores de linting, el código funcionará correctamente cuando ejecutes:

```bash
python main.py
```

Los errores de linter son solo advertencias del editor, no del código real.

---

## Configuración Completada

Ya hemos incluido:
- `.vscode/settings.json` — Configuración del workspace
- `.pylintrc` — Configuración de Pylint
- `pyrightconfig.json` — Configuración de Pyright

No necesitas hacer nada más. Solo selecciona el interpreter correcto en VS Code.
