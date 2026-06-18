# modules/auth

Autenticación y autorización a nivel de negocio (Supabase Auth + `public.usuario`).

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/prelogin` | Valida identidad y contexto (platform/tenant) |
| POST | `/auth/login` | Autentica con Supabase y retorna tokens |
| GET | `/auth/me` | Perfil y scope del usuario autenticado |
| POST | `/auth/logout` | Cierra sesión global en Supabase |

Contrato completo: [API.md](./API.md)

## Configuración

Copiar `.env.example` → `.env` y completar credenciales de Supabase (`zmdokvjewvqaftnvulsr`).
