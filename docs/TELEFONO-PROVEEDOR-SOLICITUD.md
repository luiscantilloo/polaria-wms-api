# Teléfono en empresa/cliente/comprador + proveedor en solicitud de compra

## Resumen

| Capa | Cambio |
|------|--------|
| **BD** | Columna `telefono varchar(32)` en `empresa`, `cliente`, `comprador` |
| **API** | Prisma actualizado; solicitud de compra ya soportaba `idProveedor` |
| **Web** | Campos de teléfono en modales/listas + selector de proveedor al crear solicitud |

## Base de datos

Migración: `docs/044_telefono_empresa_cliente_comprador.sql`

Ya aplicada en **polaria-wms-dev** (`zmdokvjewvqaftnvulsr`).

Copiar también a `polaria-wms-db` en `migrations/` y `supabase/migrations/`.

## API (polaria-wms-api)

Rama: `cursor/telefono-proveedor-solicitud-d2d9`

- `prisma/schema.prisma`: campos `telefono` opcionales en `Empresa`, `Cliente`, `Comprador`
- Sin cambios en endpoints de compras: `POST /compras/solicitudes` ya acepta `idProveedor`

## Web (polaria-wms-web)

Si no hay push al repo web, aplicar el patch:

```bash
cd polaria-wms-web
git checkout main && git pull
git am /ruta/a/patch-telefono-proveedor-solicitud-d2d9-web.patch
npm test
```

### Archivos tocados

- Configurador: `EmpresaCreateModal`, `EmpresasListView`, `empresas.service`
- Admin: `ClienteCreateModal`, `ClientesListView`, `clientes.service`
- Admin: `CompradorCreateModal`, `CompradoresListView`, `compradores.service`
- Compras: `SolicitudCompraCreateModal` — carga proveedores y envía `idProveedor` obligatorio en UI

### Validación de teléfono

Mismo patrón que proveedores: `PolariaPhoneInput` + `libphonenumber-js`. Opcional en empresa/cliente/comprador; se normaliza a E.164 si se ingresa.

### Solicitud de compra

El selector de proveedor es obligatorio en el modal. La API puede seguir resolviendo proveedor por defecto si no se envía, pero la UI ya lo exige explícitamente.
