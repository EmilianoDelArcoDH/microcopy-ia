# Microcopy accesible con IA

App web de actividades para el curso **Microcopy accesible con IA**.

## Tecnologias utilizadas

- **React 18** para la interfaz de usuario.
- **TypeScript** para tipado estatico de actividades, estado, validadores y servicios.
- **Vite** como entorno de desarrollo, build y preview.
- **CSS plano** en `src/styles/main.css`; no usa Tailwind ni otro framework CSS.
- **localStorage** para persistir el avance por actividad, idioma y variante.
- **PGEvent** para comunicar el resultado de validacion al contenedor padre mediante `window.top.postMessage`.
- **Cliente mock de IA** en `src/services/aiClient.ts`, preparado para una futura integracion con Groq.

## Requisitos

- Node.js 18+
- npm 9+

## Como correr

```bash
npm install
npm run dev
```

Abrir en el navegador una de estas URLs:

- `/?a=microcopy-ia-01`
- `/?a=microcopy-ia-02&lang=es`
- `/?a=microcopy-ia-03&variant=src`

Parametros soportados:

- `a`: actividad (`microcopy-ia-01`, `microcopy-ia-02`, `microcopy-ia-03`)
- `lang`: idioma (`es`, `en`, `pt`), default `es`
- `variant`: (`src`, `solution`), default `src`

## Estructura

```text
src/
  activities/
  core/
    validators/
  shared/
  ui/
    blocks/
  services/
  styles/
```

## Como agregar una actividad nueva

1. Crear archivo en `src/activities/` con la config de la actividad.
2. Definir:
   - `id`, `titulo`, `objetivo`, `supportsAI`
   - `inputsIniciales`
   - `ui.blocks`
   - `reglasValidacion` y `checklistHumano`
3. Registrar la actividad en `src/core/activityRegistry.ts`.
4. Agregar validador en `src/core/validators/`.
5. Conectar el validador en `src/core/validators/index.ts`.
6. Si hace falta un bloque nuevo, crear componente en `src/ui/blocks/` y mapearlo en `src/ui/ActivityShell.tsx`.

## Persistencia

El estado se guarda por actividad en `localStorage` con key:

```text
activity:<id>:<variant>:<lang>
```

Estado minimo guardado:

- `promptUsuario`
- `promptAlumno`
- `opcionesIA`
- `opcionElegida`
- `justificacion`
- `tablaAuditoria`
- `checklistMarcado`
- `resultadosValidacion`

## Integracion con PGEvent

El proyecto implementa `PGEvent` en `src/shared/pg-event.ts`.

Al montar la actividad, `ActivityShell` crea una instancia de `PGEvent` y lee el parametro `id` desde la URL. Al presionar **Validar**, se ejecuta el validador correspondiente y se envia un payload al contenedor padre con:

- `event`: `SUCCESS` o `FAILURE`
- `id`: identificador recibido por query string
- `reasons`: errores de validacion
- `message`: mensaje de exito o error
- `state`: snapshot serializado de la actividad y del resultado
- `type`: tipo interno definido por `PGEvent`

El envio se realiza con:

```ts
window.top?.postMessage(payload, '*');
```

## Integracion futura con Groq

El proyecto ya incluye una interfaz y un cliente mock en `src/services/aiClient.ts`:

- `interface AIClient`
- `class MockAIClient`
- `buildMicrocopyPrompt(...)`

Para integrar Groq despues:

1. Crear `.env.local` en la raiz con `VITE_GROQ_API_KEY=tu_valor`.
2. Crear `GroqAIClient` que implemente `AIClient`.
3. Reemplazar en `GroqGenerate` la instancia de `MockAIClient` por `GroqAIClient`.
4. Resolver credenciales por variables de entorno, sin hardcodear keys.
5. Mantener la misma firma `generateMicrocopy(prompt)` para no cambiar bloques ni estado.

## Notas

- No se usa `react-router`.
- No hay claves reales ni secretos en el codigo.
- El archivo `pg-event.js` queda como referencia JavaScript, pero la app usa la version TypeScript de `src/shared/pg-event.ts`.
