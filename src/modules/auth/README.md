# modules/auth

Autenticación y autorización a nivel de negocio.

## Responsabilidad

- Endpoints de login, logout y refresh token.
- Registro de nuevos usuarios.
- Recuperación y cambio de contraseña.

> **Diferencia con `core/auth/`:** este módulo expone los endpoints HTTP. `core/auth/` provee la infraestructura JWT/Passport que este módulo y el resto de la app consumen.
