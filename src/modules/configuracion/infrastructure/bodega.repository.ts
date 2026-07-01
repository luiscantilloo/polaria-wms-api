import { Injectable } from '@nestjs/common';
import { BodegaTipo } from '../../../generated/prisma/client';
import { PrismaService } from '../../../core/database/prisma.service';
import type { CreateBodegaResult } from '../interfaces/bodega.interfaces';

export interface CuentaBodegaRecord {
  codigoCuenta: string;
  codigoEmpresa: string;
  estaActiva: boolean;
  empresa: { estaActiva: boolean };
}

@Injectable()
export class BodegaRepository {
  constructor(private readonly prisma: PrismaService) {}

  findCuenta(codigoCuenta: string): Promise<CuentaBodegaRecord | null> {
    return this.prisma.cuenta.findUnique({
      where: { codigoCuenta },
      select: {
        codigoCuenta: true,
        codigoEmpresa: true,
        estaActiva: true,
        empresa: { select: { estaActiva: true } },
      },
    });
  }

  createBodega(input: {
    codigoCuenta: string;
    codigo: string;
    nombre: string;
    tipo: BodegaTipo;
    capacidadSlots: number | null;
    idCreador: string;
  }): Promise<CreateBodegaResult> {
    return this.prisma.bodega.create({
      data: {
        codigoCuenta: input.codigoCuenta,
        codigo: input.codigo,
        nombre: input.nombre,
        tipo: input.tipo,
        capacidadSlots: input.capacidadSlots,
        idCreador: input.idCreador,
        estaActiva: true,
      },
      select: {
        idBodega: true,
        codigoCuenta: true,
        codigo: true,
        nombre: true,
        tipo: true,
        capacidadSlots: true,
      },
    });
  }
}
