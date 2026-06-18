# modules/health

Health checks y estado del servicio.

## Responsabilidad

- Endpoint `/health` para verificar que la API está en ejecución.
- Comprobación de conectividad con la base de datos.
- Usado por balanceadores de carga, Kubernetes y herramientas de monitoreo.
