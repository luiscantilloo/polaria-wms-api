import { Injectable } from '@nestjs/common';
import {
  BodegaTipo,
  Prisma,
  type SolicitudIntegracion,
} from '../../../generated/prisma/client';
import { PrismaService } from '../../../core/database/prisma.service';

export interface SolicitudIntegracionRecord extends SolicitudIntegracion {
  cuenta?: { nombreComercial: string };
}

@Injectable()
export class SolicitudIntegracionRepository {
  constructor(private readonly prisma: PrismaService) {}

  findBodegaExterna(idBodega: string, codigoCuenta: string) {
    return this.prisma.bodega.findFirst({
      where: {
        idBodega,
        codigoCuenta,
        tipo: BodegaTipo.externa,
        estaActiva: true,
      },
      select: {
        idBodega: true,
        nombre: true,
        codigoCuenta: true,
      },
    });
  }

  findFirstClienteActivo(codigoCuenta: string) {
    return this.prisma.cliente.findFirst({
      where: {
        codigoCuenta,
        estaActivo: true,
      },
      select: { idCliente: true },
      orderBy: { nombre: 'asc' },
    });
  }

  findClienteActivo(idCliente: string, codigoCuenta: string) {
    return this.prisma.cliente.findFirst({
      where: {
        idCliente,
        codigoCuenta,
        estaActivo: true,
      },
      select: { idCliente: true },
    });
  }

  create(input: {
    codigoCuenta: string;
    idCliente: string;
    bodegaExternaId: string;
    bodegaExternaNombre: string;
    scraping: boolean;
    api: boolean;
    csvPlano: boolean;
    idSolicitante: string;
  }): Promise<SolicitudIntegracionRecord> {
    return this.prisma.solicitudIntegracion.create({
      data: {
        codigoCuenta: input.codigoCuenta,
        idCliente: input.idCliente,
        bodegaExternaId: input.bodegaExternaId,
        bodegaExternaNombre: input.bodegaExternaNombre,
        scraping: input.scraping,
        api: input.api,
        csvPlano: input.csvPlano,
        idSolicitante: input.idSolicitante,
      },
      include: {
        cuenta: { select: { nombreComercial: true } },
      },
    });
  }

  list(
    where: Prisma.SolicitudIntegracionWhereInput,
    includeCuenta = false,
  ): Promise<SolicitudIntegracionRecord[]> {
    return this.prisma.solicitudIntegracion.findMany({
      where,
      include: includeCuenta
        ? { cuenta: { select: { nombreComercial: true } } }
        : undefined,
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }
}
