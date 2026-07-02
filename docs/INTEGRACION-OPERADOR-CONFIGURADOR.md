# Integración: operador → configurador

## Flujo

1. **Operador de cuenta** (`/dashboard/bodega-externa/integracion`) solicita integración de una bodega externa vinculada.
2. El **API** persiste en `solicitud_integracion` (Prisma, bypass RLS).
3. **Configurador** (`/configurador/integracion`) ve la bandeja con todas las solicitudes.

## API (polaria-wms-api)

Rama: `cursor/integracion-configurador-d2d9`

| Método | Ruta | Rol |
|--------|------|-----|
| POST | `/integracion/solicitudes` | `operador_cuenta`, `administrador_cuenta` |
| GET | `/integracion/solicitudes` | `operador_cuenta`, `administrador_cuenta` |
| GET | `/configurador/integracion/solicitudes` | `configurador` |

Body POST ejemplo:

```json
{
  "codigoCuenta": "CTA001",
  "bodegaExternaId": "uuid-bodega-externa",
  "bodegaExternaNombre": "Bodega Externa Norte",
  "tipoIntegracion": "scraping"
}
```

## Web (polaria-wms-web) — copiar archivos

Desde la raíz de `polaria-wms-web` en **PowerShell**:

```powershell
$base = "https://raw.githubusercontent.com/PolariaTech/polaria-wms-api/cursor/integracion-configurador-d2d9/docs/web-integracion-files/src/modules"

Invoke-WebRequest -Uri "$base/account-integration/services/integracion-bodega.service.ts" -OutFile "src/modules/account-integration/services/integracion-bodega.service.ts"

Invoke-WebRequest -Uri "$base/configurator/services/integracion.service.ts" -OutFile "src/modules/configurator/services/integracion.service.ts"
```

Verificar:

```powershell
Select-String -Path "src/modules/configurator/services/integracion.service.ts" -Pattern "configurador/integracion/solicitudes"
Select-String -Path "src/modules/account-integration/services/integracion-bodega.service.ts" -Pattern "integracion/solicitudes"
```

## Probar

1. API con rama `cursor/integracion-configurador-d2d9` corriendo
2. Web con archivos copiados y `VITE_API_URL` al API
3. Login **operador_cuenta** → Bodega externa → Integración → Solicitar
4. Login **configurador** → Integración → debe aparecer la solicitud

## Requisitos

- Cuenta con al menos un **cliente activo** (el API lo usa si no envías `idCliente`)
- Bodega **externa** vinculada a la cuenta del operador
