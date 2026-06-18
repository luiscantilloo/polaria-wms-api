# core/config

Configuración centralizada de la aplicación.

## Responsabilidad

- Carga y validación de variables de entorno (`PORT`, `DATABASE_URL`, `JWT_SECRET`, etc.).
- Registro del `ConfigModule` de NestJS para inyección de configuración en cualquier servicio.

## Archivos previstos

| Archivo | Descripción |
|---|---|
| `env.config.ts` | Esquema y valores por defecto de las variables de entorno |
