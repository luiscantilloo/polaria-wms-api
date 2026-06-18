# core/guards

Guards reutilizables para proteger endpoints.

## Responsabilidad

- `JwtAuthGuard`: verifica que el request lleve un token JWT válido.
- `RolesGuard` / `PermissionsGuard`: comprueba que el usuario tenga el rol o permiso requerido.
- Se aplican con decoradores (`@UseGuards`, `@Roles`, `@RequirePermissions`) en los controladores.
