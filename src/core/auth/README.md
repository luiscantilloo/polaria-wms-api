# core/auth

Capa de autenticación a nivel de infraestructura.

## Responsabilidad

- Configuración de Passport y estrategia JWT.
- Módulo `AuthCoreModule` que exporta guards y servicios de token.
- Validación de credenciales en el pipeline de cada request.

> **Nota:** Los endpoints de login/registro viven en `modules/auth/`. Esta carpeta solo provee los mecanismos que el resto de la app usa para proteger rutas.
