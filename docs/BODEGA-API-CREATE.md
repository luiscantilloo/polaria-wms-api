# Crear bodegas vía API (fix RLS configurador)

## Problema

Desde el **configurador**, al crear bodega interna/externa el web insertaba directo en Supabase:

```
new row violates row-level security policy for table "bodega"
```

Aunque exista política `bodega_insert_configurador`, el JWT del cliente web puede no alinear con `auth.uid()` que evalúa RLS (handoff Mateo, sesión Supabase, etc.). El API Nest valida el JWT con Prisma y escribe con `DATABASE_URL` (bypass RLS).

## Solución

**API:** `POST /configuracion/bodegas`  
**Web:** dejar de usar `supabase.from('bodega').insert(...)` y llamar al endpoint.

## Descargar cambios

### 1. API (obligatorio)

```bash
cd polaria-wms-api
git fetch origin
git checkout cursor/bodega-api-create-d2d9
npm install
npm run start:dev
```

O solo el diff de la rama:

```bash
git fetch origin cursor/bodega-api-create-d2d9
git cherry-pick <commit-sha>
```

### 2. Web (patch)

Desde la raíz de `polaria-wms-web`:

```bash
curl -L -o /tmp/bodega-api.patch \
  "https://raw.githubusercontent.com/PolariaTech/polaria-wms-api/cursor/bodega-api-create-d2d9/docs/patch-bodega-api-create-d2d9-web.patch"

git am /tmp/bodega-api.patch
```

Si `git am` falla por cambios locales:

```bash
git am --abort
git apply --3way /tmp/bodega-api.patch
```

## Archivos web modificados

| Archivo | Cambio |
|---------|--------|
| `src/modules/configurator/services/bodegas-internas.service.ts` | `POST /configuracion/bodegas` + bootstrap layout |
| `src/modules/configurator/services/bodegas-externas.service.ts` | `POST /configuracion/bodegas` |

## Cómo probar

### API sola (Swagger o curl)

1. Levantar API: `npm run start:dev` en `polaria-wms-api`
2. Login configurador → obtener JWT
3. `POST http://localhost:3000/configuracion/bodegas`

```json
{
  "codigoCuenta": "TU_CODIGO_CUENTA",
  "codigo": "BOD-PRUEBA",
  "nombre": "Bodega Prueba",
  "tipo": "interna",
  "capacidadSlots": 10
}
```

4. Si es interna, bootstrap:

```bash
POST /configuracion/bodegas/{idBodega}/bootstrap-layout
```

### Flujo completo (web)

1. API en marcha (`VITE_API_URL` apuntando al backend)
2. Web con patch aplicado: `npm run dev`
3. Login como **configurador@polaria.tech**
4. Configurador → Bodegas internas → Nueva bodega
5. Configurador → Bodegas externas → Nueva bodega

Debe crear sin error RLS. La interna además inicializa layout (como antes).

## Variables de entorno

**API** (`.env`):

- `DATABASE_URL` — Postgres (bypass RLS)
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — auth JWT

**Web** (`.env`):

- `VITE_API_URL=http://localhost:3000` (o tu URL de API dev)

## Endpoint

| Método | Ruta | Roles |
|--------|------|-------|
| POST | `/configuracion/bodegas` | configurador, administrador_cuenta |

Documentación Swagger: `/api/docs` → tag **Configuración · Bodegas**.
