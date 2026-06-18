# test

Pruebas end-to-end (e2e) de la API.

## Responsabilidad

- Levantar la aplicación NestJS completa en memoria y hacer requests HTTP reales con `supertest`.
- Verificar flujos completos: autenticación → operación → respuesta esperada.
- Complementan las pruebas unitarias (`*.spec.ts`) que viven junto a cada archivo en `src/`.

## Archivos

| Archivo | Descripción |
|---|---|
| `app.e2e-spec.ts` | Prueba e2e del endpoint raíz |
| `jest-e2e.json` | Configuración de Jest para el entorno e2e |

## Ejecución

```bash
npm run test:e2e
```
