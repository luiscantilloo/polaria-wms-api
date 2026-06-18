import { Injectable } from '@nestjs/common';
import { WmsRol } from '../../../generated/prisma/client';
import { PrismaService } from '../../../core/database/prisma.service';

export type UsuarioWithRelations = Awaited<
  ReturnType<UsuarioRepository['findActiveByIdentificador']>
> extends infer U
  ? Exclude<U, null>
  : never;

@Injectable()
export class UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  findActiveByIdentificador(identificador: string) {
    const normalized = identificador.trim();

    return this.prisma.usuario.findFirst({
      where: {
        estaActivo: true,
        OR: [{ username: normalized }, { correo: normalized }],
      },
      include: {
        rol: true,
        empresa: true,
        cuenta: true,
      },
    });
  }

  findActiveByIdAuth(idAuth: string) {
    return this.prisma.usuario.findFirst({
      where: {
        idAuth,
        estaActivo: true,
      },
      include: {
        rol: true,
        empresa: true,
        cuenta: true,
      },
    });
  }

  isConfigurador(idRol: WmsRol | string): boolean {
    return idRol === WmsRol.configurador;
  }
}
