import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuarioRepository } from './infrastructure/usuario.repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsuarioRepository],
  exports: [AuthService],
})
export class AuthModule {}
