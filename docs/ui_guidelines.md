# Lineamientos de Diseño UI — ROOM_911

Este documento define la identidad visual y las reglas de diseño para el sistema de gestión **ROOM_911**.

## 1. Estilo General
- **Dashboard corporativo moderno**: Interfaz enfocada en monitoreo, seguridad y gestión administrativa.
- **Atmósfera**: Tecnológica, profesional, control y vigilancia.
- **Tema**: Modo Oscuro (Dark Mode).

## 2. Paleta de Colores
| Categoría | Color | Código Hex | Uso |
| :--- | :--- | :--- | :--- |
| **Fondo** | Azul marino profundo | `#081425` | Fondo principal de la aplicación. |
| **Primario** | Azul eléctrico | `#2563EB` | Botones, indicadores activos, interactivos. |
| **Éxito** | Verde neón | `#10FB72` | Accesos concedidos, validaciones exitosas. |
| **Alerta/Error** | Rojo vibrante | `#FF3131` | Accesos denegados, alertas críticas. |
| **Secundario** | Gris oscuro translúcido | `rgba(30, 41, 59, 0.7)` | Tarjetas, paneles, contenedores (Glassmorphism). |

## 3. Tipografía
- **Fuente**: [Inter](https://fonts.google.com/specimen/Inter)
- **Jerarquía**:
  - **Bold**: Títulos destacados.
  - **Medium**: Subtítulos y etiquetas.
  - **Regular**: Contenido general y datos.

## 4. Componentes y Estética
- **Esquinas**: Border Radius de **8px**.
- **Tarjetas (Cards)**: Sutil efecto de **Glassmorphism** (backdrop-filter: blur).
- **Botones**: 
  - **Uso Obligatorio**: Se debe usar siempre el componente global `Button` ubicado en `src/components/globalcomponent/Button.tsx`.
  - **Iconografía Obligatoria**: Todo botón debe incluir al menos un icono (izquierdo o derecho) para reforzar el lenguaje visual.
  - **Estética**: Efecto **Glow neón ligero** en acciones primarias y transiciones suaves de escala (hover:scale-[1.02]).
- **Sombras**: Soft shadows discretas para profundidad.
- **Iconografía**: Outline moderno y minimalista (FontAwesome).

## 5. Componentes Globales
### Button
Componente unificado para todas las acciones del sistema.
- **Ubicación**: `src/components/globalcomponent/Button.tsx`
- **Variantes**: `primary`, `success`, `error`, `secondary`.
- **Propiedades**: 
  - `iconLeft`/`iconRight`: Requerido por lineamiento (FontAwesome IconDefinition).
  - `isLoading`: Soporta estados de carga con diferentes animaciones.
  - `to`: Soporta navegación interna vía `react-router-dom`.

## 6. Experiencia y Lenguaje
- **Idioma**: Español técnico.
- **Terminología**:
  - Protocolo de Seguridad
  - Historial de Accesos
  - Ingesta de Datos
  - Validación Biométrica
- **Prioridad**: Navegación clara, rápida y Desktop First.
