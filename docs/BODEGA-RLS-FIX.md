# Fix RLS: crear bodegas internas/externas

## Síntoma

Al crear una bodega desde el cliente web (Supabase JS + JWT):

```
new row violates row-level security policy for table "bodega"
```

## Causa

El frontend escribe en `bodega` vía PostgREST con rol `authenticated`. Las políticas vigentes solo permitían:

| Política | Comando | Condición |
|----------|---------|-----------|
| `bodega_insert_configurador` | INSERT | `auth_wms_es_configurador()` |
| `bodega_update_configurador` | UPDATE | `auth_wms_es_configurador()` |

Si el usuario es **`administrador_cuenta`** (panel admin al vincular/crear bodegas), el INSERT falla aunque tenga scope correcto sobre la cuenta.

Otras tablas de catálogo por cuenta (`producto`, `cliente`, `proveedor`, etc.) ya usan `auth_wms_puede_gestionar_catalogo_cuenta(codigo_cuenta)`, que incluye configurador y administrador de cuenta en su tenant.

## Solución (migración 045)

```sql
CREATE POLICY bodega_insert_cuenta ON bodega
  FOR INSERT TO authenticated
  WITH CHECK (auth_wms_puede_gestionar_catalogo_cuenta(codigo_cuenta));

CREATE POLICY bodega_update_cuenta ON bodega
  FOR UPDATE TO authenticated
  USING (auth_wms_puede_gestionar_catalogo_cuenta(codigo_cuenta))
  WITH CHECK (auth_wms_puede_gestionar_catalogo_cuenta(codigo_cuenta));
```

Las políticas de configurador se mantienen; en Postgres varias políticas del mismo comando se evalúan con **OR**.

## Aplicar en dev

```bash
# Desde polaria-wms-db o vía Supabase MCP apply_migration
# Archivo: docs/045_bodega_rls_admin_cuenta.sql
```

## Nota sobre `asignacion_bodega`

Crear la fila en `bodega` queda resuelto. Si al vincular usuarios a la bodega aparece error en `asignacion_bodega`, esa tabla sigue con INSERT solo para configurador; habría que extenderla en una migración aparte.
