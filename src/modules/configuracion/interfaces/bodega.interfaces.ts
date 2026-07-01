import type { BodegaTipo } from '../../../generated/prisma/client';

export interface CreateBodegaResult {
  idBodega: string;
  codigoCuenta: string;
  codigo: string;
  nombre: string;
  tipo: BodegaTipo;
  capacidadSlots: number | null;
}
