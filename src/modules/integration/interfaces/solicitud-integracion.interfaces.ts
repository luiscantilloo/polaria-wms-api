import type { EstadoIntegracion } from '../../../generated/prisma/client';
import type { TipoIntegracionApi } from '../constants/integration.constants';

export interface SolicitudIntegracionResponse {
  idSolicitudIntegracion: string;
  codigoCuenta: string;
  cuentaNombre?: string;
  bodegaExternaId: string;
  bodegaNombre: string;
  tipoIntegracion: TipoIntegracionApi | null;
  estado: EstadoIntegracion;
  createdAt: string;
}
