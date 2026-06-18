# modules/audit

Registro de auditoría del sistema.

## Responsabilidad

- Registrar acciones de usuarios: creación, edición y eliminación de entidades.
- Almacenar quién realizó la acción, cuándo y qué datos cambiaron.
- Consultas de historial para cumplimiento y trazabilidad.

## Arquitectura (clean architecture)

| Carpeta | Capa | Descripción |
|---|---|---|
| `domain/` | Dominio | Entidades y reglas de negocio del audit log |
| `application/` | Aplicación | Casos de uso: registrar evento, consultar historial |
| `infrastructure/` | Infraestructura | Repositorio Prisma, adaptadores de persistencia |
