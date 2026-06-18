# shared/decorators

Decoradores personalizados de NestJS.

## Ejemplos previstos

| Decorador | Uso |
|---|---|
| `@CurrentUser()` | Inyecta el usuario autenticado en el handler |
| `@Roles(...)` | Restringe el endpoint a ciertos roles |
| `@RequirePermissions(...)` | Restringe el endpoint a ciertos permisos |
| `@Public()` | Marca un endpoint como accesible sin autenticación |
