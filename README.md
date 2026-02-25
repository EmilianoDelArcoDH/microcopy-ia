# Microcopy accesible con IA

App web de actividades para el curso **Microcopy accesible con IA**.

## Requisitos

- Node.js 18+
- npm 9+

## Cómo correr

```bash
npm install
npm run dev
```

Abrí en el navegador una de estas URLs:

- `/?a=microcopy-ia-01`
- `/?a=microcopy-ia-02&lang=es`
- `/?a=microcopy-ia-03&variant=src`

Parámetros soportados:

- `a`: actividad (`microcopy-ia-01`, `microcopy-ia-02`, `microcopy-ia-03`)
- `lang`: idioma (`es`, `en`, `pt`), default `es`
- `variant`: (`src`, `solution`), default `src`

## Estructura

```text
src/
  activities/
  core/
    validators/
  ui/
    blocks/
  services/
  styles/
```

## Cómo agregar una actividad nueva

1. Crear archivo en `src/activities/` con la config de la actividad.
2. Definir:
   - `id`, `titulo`, `objetivo`, `supportsAI`
   - `inputsIniciales`
   - `ui.blocks`
   - `reglasValidacion` y `checklistHumano`
3. Registrar la actividad en `src/core/activityRegistry.ts`.
4. Agregar validador en `src/core/validators/`.
5. Conectar el validador en `src/core/validators/index.ts`.
6. Si necesitás un bloque nuevo, crear componente en `src/ui/blocks/` y mapearlo en `src/ui/ActivityShell.tsx`.

## Persistencia

El estado se guarda por actividad en `localStorage` con key:

```text
activity:<id>:<variant>:<lang>
```

Estado mínimo guardado:

- `promptUsuario`
- `opcionesIA`
- `opcionElegida`
- `tablaAuditoria`
- `resultadosValidacion`

## Integración futura con Groq (sin claves)

El proyecto ya incluye una interfaz y un cliente mock en `src/services/aiClient.ts`:

- `interface AIClient`
- `class MockAIClient`
- `buildMicrocopyPrompt(...)`

Para integrar Groq después:

0. Crear `.env.local` en la raíz con `VITE_GROQ_API_KEY=tu_valor`.
1. Crear `GroqAIClient` que implemente `AIClient`.
2. Reemplazar en `GroqGenerate` la instancia de `MockAIClient` por `GroqAIClient`.
3. Resolver credenciales por variables de entorno (sin hardcodear keys).
4. Mantener la misma firma `generateMicrocopy(prompt)` para no cambiar bloques ni estado.

## Notas

- No se usa `react-router`.
- No se implementa PGEvent.
- No hay claves reales ni secretos en el código.
- CSS simple sin Tailwind.