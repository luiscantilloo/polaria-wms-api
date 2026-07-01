# Orden de compra — UI estilo frio

## Resumen

| Capa | Cambio |
|------|--------|
| **BD** | Sin cambios (`orden_compra`, `orden_compra_linea`, `observaciones` ya existen) |
| **API Nest** | Sin cambios (`POST /compras/ordenes` ya crea OC manual con proveedor + líneas) |
| **Web** | Tabla alineada a frio + modal «Nueva orden» con selector de proveedor |

## Tabla de órdenes (pestaña Órdenes)

Columnas:

| Columna | Fuente |
|---------|--------|
| **Orden** | `codigo` (ej. OC-0001) |
| **Proveedor** | `proveedor.razon_social` (nombre legible) |
| **Productos** | Líneas → títulos del catálogo unidos con ` · ` |
| **Estado** | `estado` (Borrador, Emitida, …) |
| **Fecha** | `fecha_emision` |
| **Observación** | `observaciones` (— si vacío) |
| **Acciones** | Emitir OC / Notificar proveedor |

## Crear orden manual

Botón **«Nueva orden»** en la pestaña Órdenes.

Campos del modal:

- **Proveedor** (obligatorio, selector)
- **Fecha** (mapea a `fechaEntregaEstimada` en API)
- **Observación** (opcional)
- **Productos** del catálogo + peso kg (líneas)

Flujo:

```
Modal → POST /compras/ordenes (Nest)
      → OC en estado borrador
      → Tabla se recarga
```

## Aplicar patch web

Requiere tener ya telefono/proveedor/webhook si aplica en tu rama.

```powershell
cd C:\Users\...\Videos\polaria-wms-web

Invoke-WebRequest `
  -Uri "https://raw.githubusercontent.com/PolariaTech/polaria-wms-api/cursor/orden-compra-frio-ui-d2d9/docs/patch-orden-compra-frio-ui-d2d9-web.patch" `
  -OutFile "patch-orden-compra-frio-ui-d2d9-web.patch"

git am patch-orden-compra-frio-ui-d2d9-web.patch
npm test
```

## Diferencias vs frio (Firebase)

| frio | Polaria v2 |
|------|------------|
| Estado editable inline en tabla | Estados del workflow Nest (borrador → emitida → …) |
| Proveedor auto en modal frio | **Selector de proveedor** (pedido explícito) |
| `fecha` libre en documento | `fecha_emision` al crear + fecha entrega opcional |
