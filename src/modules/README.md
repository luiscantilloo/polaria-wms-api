# modules

Módulos de negocio del WMS. Cada carpeta representa un dominio funcional con su propio `Module`, controladores, servicios y DTOs.

## Módulos

| Módulo | Dominio |
|---|---|
| `accounts` | Contabilidad y cuentas contables |
| `audit` | Registro de auditoría (quién hizo qué y cuándo) |
| `auth` | Login, registro y gestión de sesiones |
| `companies` | Empresas / tenants del sistema |
| `files` | Carga y gestión de archivos adjuntos |
| `health` | Health checks para monitoreo y despliegue |
| `inventory` | Stock, productos y existencias |
| `notifications` | Notificaciones (email, push, in-app) |
| `processing` | Procesamiento de órdenes (picking, packing) |
| `purchases` | Órdenes de compra a proveedores |
| `sales` | Órdenes de venta a clientes |
| `settings` | Configuración por empresa o usuario |
| `transport` | Envíos, transportistas y entregas |
| `users` | Gestión de usuarios y perfiles |
| `warehouses` | Almacenes, zonas y ubicaciones |

## Estructura típica de un módulo

```
modules/<nombre>/
├── <nombre>.module.ts
├── <nombre>.controller.ts
├── <nombre>.service.ts
└── dto/
```

Algunos módulos complejos (como `audit`) siguen arquitectura limpia con subcarpetas `domain/`, `application/` e `infrastructure/`.
