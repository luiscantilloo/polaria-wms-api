# core/database

Capa de acceso a base de datos.

## Responsabilidad

- `PrismaService`: cliente Prisma inyectable como servicio NestJS.
- `DatabaseModule`: módulo global que exporta `PrismaService` para todo el proyecto.
- Ciclo de vida de la conexión (conectar al iniciar, desconectar al cerrar).

## Archivos previstos

| Archivo | Descripción |
|---|---|
| `prisma.service.ts` | Wrapper del cliente `@prisma/client` |
| `database.module.ts` | Módulo NestJS que registra y exporta Prisma |
