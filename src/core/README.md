# core

Infraestructura transversal de la aplicación. Contiene todo lo que **no** es lógica de negocio del WMS: conexión a base de datos, autenticación, configuración, guards, filtros e interceptores.

Estos módulos se importan desde `app.module.ts` o desde los módulos de negocio que los necesiten.

## Subcarpetas

| Carpeta | Responsabilidad |
|---|---|
| `auth/` | Estrategias Passport, módulo JWT, decoradores de autenticación |
| `config/` | Variables de entorno y configuración centralizada |
| `database/` | Conexión Prisma, `DatabaseModule` y `PrismaService` |
| `filters/` | Filtros globales de excepciones (respuestas de error uniformes) |
| `guards/` | Guards reutilizables (JWT, roles, permisos) |
| `interceptors/` | Interceptores HTTP (logging, transformación de respuestas) |
