import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SupabaseAuthService } from '../../core/auth/supabase-auth.service';
import {
  AUTH_FLOW,
  AUTH_SCOPE,
  ROL_CONFIGURADOR,
} from '../../shared/constants/auth.constants';
import { LoginDto } from './dto/login.dto';
import { PreloginDto } from './dto/prelogin.dto';
import type {
  LoginResponse,
  MeResponse,
  PreloginResponse,
  SessionContext,
  UserPreview,
  ValidatedUserContext,
} from './interfaces/auth.interfaces';
import {
  UsuarioRepository,
  UsuarioWithRelations,
} from './infrastructure/usuario.repository';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly supabaseAuth: SupabaseAuthService,
  ) {}

  async prelogin(dto: PreloginDto): Promise<PreloginResponse> {
    const context = await this.validateUserAccess(
      dto.identificador,
      dto.codigoEmpresa,
    );

    return {
      ok: true,
      requiresPassword: true,
      flow: context.flow,
      userPreview: this.toUserPreview(context.usuario),
    };
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    const context = await this.validateUserAccess(
      dto.identificador,
      dto.codigoEmpresa,
    );

    const tokens = await this.supabaseAuth.signInWithPassword(
      context.usuario.correo,
      dto.password,
    );

    this.logger.log(
      `Login exitoso: usuario=${context.usuario.idUsuario} scope=${context.scope}`,
    );

    return {
      ...tokens,
      context: this.toSessionContext(context),
    };
  }

  async getMe(idAuth: string): Promise<MeResponse> {
    const usuario = await this.usuarioRepository.findActiveByIdAuth(idAuth);

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado o inactivo');
    }

    const isConfigurador = this.usuarioRepository.isConfigurador(usuario.idRol);

    return {
      idUsuario: usuario.idUsuario,
      idAuth: usuario.idAuth,
      nombre: usuario.nombre,
      username: usuario.username,
      correo: usuario.correo,
      idRol: usuario.idRol,
      nombreRol: usuario.rol.nombre,
      nivelRol: usuario.rol.nivel,
      codigoEmpresa: isConfigurador ? null : usuario.codigoEmpresa,
      razonSocialEmpresa: isConfigurador
        ? null
        : (usuario.empresa?.razonSocial ?? null),
      codigoCuenta: isConfigurador ? null : usuario.codigoCuenta,
      nombreComercialCuenta: isConfigurador
        ? null
        : (usuario.cuenta?.nombreComercial ?? null),
      scope: isConfigurador ? AUTH_SCOPE.PLATFORM : AUTH_SCOPE.TENANT,
    };
  }

  async logout(accessToken: string): Promise<void> {
    await this.supabaseAuth.signOut(accessToken);
    this.logger.log('Sesión cerrada correctamente');
  }

  private async validateUserAccess(
    identificador: string,
    codigoEmpresa?: string,
  ): Promise<ValidatedUserContext> {
    const usuario = await this.usuarioRepository.findActiveByIdentificador(
      identificador.trim(),
    );

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado o inactivo');
    }

    const isConfigurador = this.usuarioRepository.isConfigurador(usuario.idRol);

    if (isConfigurador) {
      return {
        usuario,
        flow: AUTH_FLOW.PLATFORM,
        scope: AUTH_SCOPE.PLATFORM,
      };
    }

    if (!codigoEmpresa?.trim()) {
      throw new UnprocessableEntityException(
        'codigoEmpresa es obligatorio para usuarios de tenant',
      );
    }

    const codigoEmpresaNormalizado = codigoEmpresa.trim();

    if (usuario.codigoEmpresa !== codigoEmpresaNormalizado) {
      throw new ForbiddenException(
        'El usuario no pertenece a la empresa indicada',
      );
    }

    if (!usuario.empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    if (!usuario.empresa.estaActiva) {
      throw new ForbiddenException('La empresa está inactiva');
    }

    if (usuario.codigoCuenta && usuario.cuenta && !usuario.cuenta.estaActiva) {
      throw new ForbiddenException('La cuenta está inactiva');
    }

    return {
      usuario,
      flow: AUTH_FLOW.TENANT,
      scope: AUTH_SCOPE.TENANT,
    };
  }

  private toUserPreview(usuario: UsuarioWithRelations): UserPreview {
    const isConfigurador = usuario.idRol === ROL_CONFIGURADOR;

    return {
      idUsuario: usuario.idUsuario,
      nombre: usuario.nombre,
      username: usuario.username,
      idRol: usuario.idRol,
      nombreRol: usuario.rol.nombre,
      codigoEmpresa: isConfigurador ? null : usuario.codigoEmpresa,
      codigoCuenta: isConfigurador ? null : usuario.codigoCuenta,
    };
  }

  private toSessionContext(context: ValidatedUserContext): SessionContext {
    const isConfigurador = this.usuarioRepository.isConfigurador(
      context.usuario.idRol,
    );

    return {
      idUsuario: context.usuario.idUsuario,
      idRol: context.usuario.idRol,
      codigoEmpresa: isConfigurador ? null : context.usuario.codigoEmpresa,
      codigoCuenta: isConfigurador ? null : context.usuario.codigoCuenta,
      scope: context.scope,
    };
  }
}
