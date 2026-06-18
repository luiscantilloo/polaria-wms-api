# src

Código fuente principal de la API. Sigue una arquitectura modular de NestJS dividida en tres capas:

```
src/
├── main.ts           # Punto de entrada: arranca el servidor HTTP
├── app.module.ts     # Módulo raíz que importa el resto de módulos
├── app.controller.ts # Controlador raíz (temporal / health básico)
├── app.service.ts    # Servicio raíz
├── core/             # Infraestructura transversal (no es lógica de negocio)
├── modules/          # Dominios de negocio del WMS
└── shared/           # Tipos, constantes y utilidades compartidas
```

## Convenciones

- Cada módulo de negocio vive en `modules/<nombre>/` con su propio controller, service y DTOs.
- La lógica transversal (autenticación, base de datos, filtros de error) va en `core/`.
- Lo que usan varios módulos a la vez va en `shared/`.
