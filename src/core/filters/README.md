# core/filters

Filtros globales de excepciones HTTP.

## Responsabilidad

- Capturar errores no controlados y devolver respuestas JSON consistentes.
- Mapear excepciones de Prisma, validación (`class-validator`) y errores de negocio a códigos HTTP adecuados.
- Registrar errores internos sin exponer detalles sensibles al cliente.
