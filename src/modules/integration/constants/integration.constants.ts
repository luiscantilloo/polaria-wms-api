import { WmsRol } from '../../../generated/prisma/client';

export const ROLES_INTEGRACION_ESCRITURA = [
  WmsRol.administrador_cuenta,
  WmsRol.operador_cuenta,
] as const;

export const ROLES_INTEGRACION_LECTURA_CUENTA = [
  ...ROLES_INTEGRACION_ESCRITURA,
] as const;

export type TipoIntegracionApi = 'scraping' | 'api' | 'csv_plano';

export function mapTipoIntegracionToFlags(tipo: TipoIntegracionApi): {
  scraping: boolean;
  api: boolean;
  csvPlano: boolean;
} {
  return {
    scraping: tipo === 'scraping',
    api: tipo === 'api',
    csvPlano: tipo === 'csv_plano',
  };
}

export function resolveTipoIntegracionFromFlags(flags: {
  scraping: boolean;
  api: boolean;
  csvPlano: boolean;
}): TipoIntegracionApi | null {
  if (flags.scraping) return 'scraping';
  if (flags.api) return 'api';
  if (flags.csvPlano) return 'csv_plano';
  return null;
}
