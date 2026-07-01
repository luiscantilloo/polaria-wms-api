import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BodegaTipo } from '../../../generated/prisma/client';

export class CreateBodegaResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  idBodega!: string;

  @ApiProperty({ example: 'CTA001' })
  codigoCuenta!: string;

  @ApiProperty({ example: 'BOD-CENTRAL' })
  codigo!: string;

  @ApiProperty({ example: 'Bodega Central' })
  nombre!: string;

  @ApiProperty({ enum: BodegaTipo, example: BodegaTipo.interna })
  tipo!: BodegaTipo;

  @ApiPropertyOptional({ example: 50, nullable: true })
  capacidadSlots!: number | null;
}
