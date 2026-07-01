# Catálogo — cierre pendiente

Artefactos para aplicar manualmente cuando el agente no tiene push a `polaria-wms-web` ni `polaria-wms-db`.

## Web (`polaria-wms-web`)

```powershell
cd polaria-wms-web
git checkout main
git pull
git checkout -b cursor/catalogo-completar-d2d9
curl -o catalogo-completar.patch https://raw.githubusercontent.com/PolariaTech/polaria-wms-api/cursor/catalogo-completar-d2d9/docs/patch-catalogo-completar-d2d9-web.patch
git am catalogo-completar.patch
npm test
npm run build
git push -u origin cursor/catalogo-completar-d2d9
```

Cambios:
- Excel: `costPerItem` como fallback de `precio` / `price` (estilo frio)
- Modal secundario: valida proveedor, categoría, estado y precio

## Base de datos (`polaria-wms-db`)

```powershell
cd polaria-wms-db
git checkout main
git pull
git checkout -b cursor/catalogo-completar-d2d9
curl -o catalogo-db.patch https://raw.githubusercontent.com/PolariaTech/polaria-wms-api/cursor/catalogo-completar-d2d9/docs/patch-catalogo-completar-d2d9-db.patch
git am catalogo-db.patch
git push -u origin cursor/catalogo-completar-d2d9
```

O ejecutar directamente en Supabase: `docs/043_producto_metadatos_catalogo.sql`

## API

Sin cambios de código Nest (catálogo = Supabase directo desde web).
