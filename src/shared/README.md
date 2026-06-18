# shared

Código reutilizable entre módulos de negocio. No contiene lógica de dominio; solo tipos, constantes, utilidades y decoradores compartidos.

## Subcarpetas

| Carpeta | Descripción |
|---|---|
| `constants/` | Roles, permisos y otras constantes globales |
| `decorators/` | Decoradores personalizados (`@CurrentUser`, `@Roles`, etc.) |
| `dtos/` | DTOs base reutilizados por varios módulos |
| `interfaces/` | Interfaces TypeScript compartidas |
| `utils/` | Funciones auxiliares (fechas, paginación, hashing) |
