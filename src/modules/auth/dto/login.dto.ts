import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  identificador!: string;

  @IsOptional()
  @IsString()
  codigoEmpresa?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  password!: string;
}
