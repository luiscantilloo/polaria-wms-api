import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseAuthService } from '../../core/auth/supabase-auth.service';
import { WmsRol } from '../../generated/prisma/client';
import { AuthService } from './auth.service';
import { UsuarioRepository } from './infrastructure/usuario.repository';

const mockConfigurador = {
  idUsuario: 'usr-config',
  idAuth: 'auth-config',
  idRol: WmsRol.configurador,
  codigoEmpresa: null,
  codigoCuenta: null,
  nombre: 'Config TI',
  username: 'config.ti',
  correo: 'config@polaria.tech',
  estaActivo: true,
  rol: {
    idRol: WmsRol.configurador,
    nombre: 'Configurador (TI)',
    nivel: 'plataforma',
  },
  empresa: null,
  cuenta: null,
};

const mockTenantUser = {
  idUsuario: 'usr-tenant',
  idAuth: 'auth-tenant',
  idRol: WmsRol.administrador_cuenta,
  codigoEmpresa: 'EMP001',
  codigoCuenta: null,
  nombre: 'Admin Cuenta',
  username: 'admin.cuenta',
  correo: 'admin@empresa.com',
  estaActivo: true,
  rol: {
    idRol: WmsRol.administrador_cuenta,
    nombre: 'Administrador de cuenta',
    nivel: 'cuenta',
  },
  empresa: {
    codigoEmpresa: 'EMP001',
    razonSocial: 'Empresa Demo SA',
    estaActiva: true,
  },
  cuenta: null,
};

describe('AuthService', () => {
  let service: AuthService;
  let usuarioRepository: jest.Mocked<UsuarioRepository>;
  let supabaseAuth: jest.Mocked<SupabaseAuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsuarioRepository,
          useValue: {
            findActiveByIdentificador: jest.fn(),
            findActiveByIdAuth: jest.fn(),
            isConfigurador: jest.fn((idRol: string) => idRol === WmsRol.configurador),
          },
        },
        {
          provide: SupabaseAuthService,
          useValue: {
            signInWithPassword: jest.fn(),
            getUserFromToken: jest.fn(),
            signOut: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    usuarioRepository = module.get(UsuarioRepository);
    supabaseAuth = module.get(SupabaseAuthService);
  });

  describe('prelogin', () => {
    it('retorna flow platform para configurador sin codigoEmpresa', async () => {
      usuarioRepository.findActiveByIdentificador.mockResolvedValue(
        mockConfigurador as never,
      );

      const result = await service.prelogin({ identificador: 'config.ti' });

      expect(result).toEqual({
        ok: true,
        requiresPassword: true,
        flow: 'platform',
        userPreview: {
          idUsuario: 'usr-config',
          nombre: 'Config TI',
          username: 'config.ti',
          idRol: WmsRol.configurador,
          nombreRol: 'Configurador (TI)',
          codigoEmpresa: null,
          codigoCuenta: null,
        },
      });
    });

    it('retorna flow tenant cuando codigoEmpresa coincide', async () => {
      usuarioRepository.findActiveByIdentificador.mockResolvedValue(
        mockTenantUser as never,
      );

      const result = await service.prelogin({
        identificador: 'admin.cuenta',
        codigoEmpresa: 'EMP001',
      });

      expect(result.flow).toBe('tenant');
      expect(result.userPreview.codigoEmpresa).toBe('EMP001');
    });

    it('lanza 404 si usuario no existe', async () => {
      usuarioRepository.findActiveByIdentificador.mockResolvedValue(null);

      await expect(
        service.prelogin({ identificador: 'inexistente' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('lanza 422 si tenant no envía codigoEmpresa', async () => {
      usuarioRepository.findActiveByIdentificador.mockResolvedValue(
        mockTenantUser as never,
      );

      await expect(
        service.prelogin({ identificador: 'admin.cuenta' }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('lanza 403 si codigoEmpresa no coincide', async () => {
      usuarioRepository.findActiveByIdentificador.mockResolvedValue(
        mockTenantUser as never,
      );

      await expect(
        service.prelogin({
          identificador: 'admin.cuenta',
          codigoEmpresa: 'OTRA',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('lanza 403 si empresa está inactiva', async () => {
      usuarioRepository.findActiveByIdentificador.mockResolvedValue({
        ...mockTenantUser,
        empresa: { ...mockTenantUser.empresa, estaActiva: false },
      } as never);

      await expect(
        service.prelogin({
          identificador: 'admin.cuenta',
          codigoEmpresa: 'EMP001',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('login', () => {
    it('autentica y retorna tokens + contexto tenant', async () => {
      usuarioRepository.findActiveByIdentificador.mockResolvedValue(
        mockTenantUser as never,
      );
      supabaseAuth.signInWithPassword.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600,
        tokenType: 'bearer',
      });

      const result = await service.login({
        identificador: 'admin.cuenta',
        codigoEmpresa: 'EMP001',
        password: 'secret',
      });

      expect(supabaseAuth.signInWithPassword).toHaveBeenCalledWith(
        'admin@empresa.com',
        'secret',
      );
      expect(result.accessToken).toBe('access-token');
      expect(result.context).toEqual({
        idUsuario: 'usr-tenant',
        idRol: WmsRol.administrador_cuenta,
        codigoEmpresa: 'EMP001',
        codigoCuenta: null,
        scope: 'tenant',
      });
    });

    it('propaga 401 de Supabase Auth', async () => {
      usuarioRepository.findActiveByIdentificador.mockResolvedValue(
        mockConfigurador as never,
      );
      supabaseAuth.signInWithPassword.mockRejectedValue(
        new UnauthorizedException('Credenciales inválidas'),
      );

      await expect(
        service.login({
          identificador: 'config.ti',
          password: 'wrong',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getMe', () => {
    it('retorna scope platform para configurador', async () => {
      usuarioRepository.findActiveByIdAuth.mockResolvedValue(
        mockConfigurador as never,
      );

      const result = await service.getMe('auth-config');

      expect(result.scope).toBe('platform');
      expect(result.codigoEmpresa).toBeNull();
      expect(result.codigoCuenta).toBeNull();
    });

    it('retorna scope tenant con datos de empresa', async () => {
      usuarioRepository.findActiveByIdAuth.mockResolvedValue(
        mockTenantUser as never,
      );

      const result = await service.getMe('auth-tenant');

      expect(result.scope).toBe('tenant');
      expect(result.razonSocialEmpresa).toBe('Empresa Demo SA');
    });

    it('lanza 404 si no hay usuario activo', async () => {
      usuarioRepository.findActiveByIdAuth.mockResolvedValue(null);

      await expect(service.getMe('auth-unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('logout', () => {
    it('delega cierre de sesión a Supabase', async () => {
      supabaseAuth.signOut.mockResolvedValue(undefined);

      await service.logout('access-token');

      expect(supabaseAuth.signOut).toHaveBeenCalledWith('access-token');
    });
  });
});
