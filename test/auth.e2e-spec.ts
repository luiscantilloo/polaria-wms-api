import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { SupabaseAuthGuard } from '../src/core/auth/supabase-auth.guard';
import { SupabaseAuthService } from '../src/core/auth/supabase-auth.service';
import { GlobalExceptionFilter } from '../src/core/filters/global-exception.filter';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthService } from '../src/modules/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let authService: {
    prelogin: jest.Mock;
    login: jest.Mock;
    getMe: jest.Mock;
    logout: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      prelogin: jest.fn(),
      login: jest.fn(),
      getMe: jest.fn(),
      logout: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        {
          provide: SupabaseAuthService,
          useValue: {
            getUserFromToken: jest.fn().mockResolvedValue({ id: 'auth-tenant' }),
            signOut: jest.fn(),
          },
        },
        SupabaseAuthGuard,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /auth/prelogin responde 200 con flow platform', async () => {
    authService.prelogin.mockResolvedValue({
      ok: true,
      requiresPassword: true,
      flow: 'platform',
      userPreview: {
        idUsuario: 'usr-1',
        nombre: 'Config',
        username: 'config.ti',
        idRol: 'configurador',
        nombreRol: 'Configurador (TI)',
        codigoEmpresa: null,
        codigoCuenta: null,
      },
    });

    await request(app.getHttpServer())
      .post('/auth/prelogin')
      .send({ identificador: 'config.ti' })
      .expect(200)
      .expect((res) => {
        expect(res.body.flow).toBe('platform');
      });
  });

  it('POST /auth/prelogin responde 400 con body inválido', async () => {
    await request(app.getHttpServer())
      .post('/auth/prelogin')
      .send({})
      .expect(400);
  });

  it('POST /auth/login responde 200 con tokens', async () => {
    authService.login.mockResolvedValue({
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresIn: 3600,
      tokenType: 'bearer',
      context: {
        idUsuario: 'usr-1',
        idRol: 'configurador',
        codigoEmpresa: null,
        codigoCuenta: null,
        scope: 'platform',
      },
    });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        identificador: 'config.ti',
        password: 'secret',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.accessToken).toBe('token');
      });
  });

  it('GET /auth/me responde 401 sin token', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('GET /auth/me responde 200 con token', async () => {
    authService.getMe.mockResolvedValue({
      idUsuario: 'usr-1',
      idAuth: 'auth-tenant',
      nombre: 'Admin',
      username: 'admin',
      correo: 'admin@test.com',
      idRol: 'administrador_cuenta',
      nombreRol: 'Administrador de cuenta',
      nivelRol: 'cuenta',
      codigoEmpresa: 'EMP001',
      razonSocialEmpresa: 'Demo',
      codigoCuenta: null,
      nombreComercialCuenta: null,
      scope: 'tenant',
    });

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer valid-token')
      .expect(200)
      .expect((res) => {
        expect(res.body.scope).toBe('tenant');
      });
  });

  it('POST /auth/logout responde 204', async () => {
    authService.logout.mockResolvedValue(undefined);

    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', 'Bearer valid-token')
      .expect(204);
  });
});
