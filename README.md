# Polaria WMS API

API backend del sistema de gestión de almacenes (WMS) de Polaria. Construida con [NestJS](https://nestjs.com) y TypeScript.

## Estructura del proyecto

```
polaria-wms-api/
├── .github/          # Automatización CI/CD con GitHub Actions
├── src/              # Código fuente de la aplicación
│   ├── core/         # Infraestructura transversal (auth, DB, guards, etc.)
│   ├── modules/      # Módulos de negocio por dominio
│   └── shared/       # Código reutilizable entre módulos
└── test/             # Pruebas end-to-end (e2e)
```

## Requisitos

- Node.js 20+
- npm

## Instalación

```bash
npm install
```

## Ejecución

```bash
# Desarrollo con recarga automática
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Pruebas

```bash
npm run test        # Unitarias
npm run test:e2e    # End-to-end
npm run test:cov    # Cobertura
```

## Stack principal

| Tecnología | Uso |
|---|---|
| NestJS | Framework HTTP y módulos |
| Prisma | ORM y acceso a base de datos |
| Passport + JWT | Autenticación |
| class-validator | Validación de DTOs |

## Documentación por carpeta

Cada carpeta del proyecto incluye un `README.md` que describe su responsabilidad. Consulta `src/README.md` como punto de entrada al código fuente.
