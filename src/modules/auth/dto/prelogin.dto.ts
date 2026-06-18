import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PreloginDto {
  @IsString()
  @IsNotEmpty()
  identificador!: string;

  @IsOptional()
  @IsString()
  codigoEmpresa?: string;
}
