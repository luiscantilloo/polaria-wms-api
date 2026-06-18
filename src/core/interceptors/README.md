# core/interceptors

Interceptores HTTP transversales.

## Responsabilidad

- Transformar respuestas al formato estándar de la API (`{ data, meta }`).
- Registrar tiempo de respuesta y datos de cada request (logging).
- Añadir headers comunes (paginación, correlación de requests).
