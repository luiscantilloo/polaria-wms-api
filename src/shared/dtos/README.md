# shared/dtos

DTOs (Data Transfer Objects) compartidos entre módulos.

## Responsabilidad

- DTOs base con campos comunes (`id`, `createdAt`, `updatedAt`).
- DTOs de paginación (`PaginationDto`, `PaginatedResponseDto`).
- DTOs de respuesta estándar de la API.

Cada módulo define sus propios DTOs específicos dentro de su carpeta; aquí solo van los que usan dos o más módulos.
