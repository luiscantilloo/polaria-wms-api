import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { SupabaseAuthService } from '../src/core/auth/supabase-auth.service';
import { GlobalExceptionFilter } from '../src/core/filters/global-exception.filter';
import { JwtAuthGuard } from '../src/core/guards/jwt-auth.guard';
import { RolesGuard } from '../src/core/guards/roles.guard';
import { TenantGuard } from '../src/core/guards/tenant.guard';
import { TenantService } from '../src/core/tenant/tenant.service';
import { RolNivel, WmsRol } from '../src/generated/prisma/client';
import { AdministracionUsuariosController } from '../src/modules/configurator/controllers/administracion-usuarios.controller';
import { AdministracionUsuariosService } from '../src/modules/configurator/services/administracion-usuarios.service';

describe('AdministracionUsuariosController (e2e)', () => {
  let app: INestApplication<App>;
  let usuariosService: { create: jest.Mock };

  const adminContext = {
    idUsuario: 'usr-admin',
    idRol: WmsRol.administrador_cuenta,
    nivelRol: RolNivel.cuenta,
    codigoEmpresa: 'EMP001',
    codigoCuenta: 'CTA001',
    idBodegas: [],
  };

  const operadorContext = {
    idUsuario: 'usr-operador',
    idRol: WmsRol.operador_cuenta,
    nivelRol: RolNivel.cuenta,
    codigoEmpresa: 'EMP001',
    codigoCuenta: 'CTA001',
    idBodegas: [],
  };

  beforeEach(async () => {
    usuariosService = { create: jest.fn() };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AdministracionUsuariosController],
      providers: [
        { provide: AdministracionUsuariosService, useValue: usuariosService },
        {
          provide: SupabaseAuthService,
          useValue: {
            getUserFromToken: jest.fn().mockResolvedValue({ id: 'auth-admin' }),
          },
        },
        {
          provide: TenantService,
          useValue: {
            buildContext: jest.fn().mockResolvedValue(adminContext),
          },
        },
        JwtAuthGuard,
        TenantGuard,
        RolesGuard,
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

  it('POST /administracion/usuarios responde 401 sin token', async () => {
    await request(app.getHttpServer())
      .post('/administracion/usuarios')
      .send({
        username: 'nuevo',
        nombre: 'Nuevo',
        idRol: WmsRol.operario,
        idBodega: '550e8400-e29b-41d4-a716-446655440000',
        correo: 'nuevo@test.com',
        password: 'secret1',
      })
      .expect(401);
  });

  it('POST /administracion/usuarios responde 403 para operador sin permiso', async () => {
    const tenantService = app.get(TenantService);
    (tenantService.buildContext as jest.Mock).mockResolvedValue(operadorContext);

    await request(app.getHttpServer())
      .post('/administracion/usuarios')
      .set('Authorization', 'Bearer operador-token')
      .send({
        username: 'nuevo',
        nombre: 'Nuevo',
        idRol: WmsRol.operario,
        idBodega: '550e8400-e29b-41d4-a716-446655440000',
        correo: 'nuevo@test.com',
        password: 'secret1',
      })
      .expect(403);
  });

  it('POST /administracion/usuarios responde 400 con body inválido', async () => {
    await request(app.getHttpServer())
      .post('/administracion/usuarios')
      .set('Authorization', 'Bearer admin-token')
      .send({ username: 'x' })
      .expect(400);
  });

  it('POST /administracion/usuarios responde 201 para administrador_cuenta', async () => {
    usuariosService.create.mockResolvedValue({
      idUsuario: 'usr-new',
      username: 'operario.b1',
      nombre: 'Operario',
      idRol: WmsRol.operario,
      codigoCuenta: 'CTA001',
      correo: 'operario@test.com',
    });

    await request(app.getHttpServer())
      .post('/administracion/usuarios')
      .set('Authorization', 'Bearer admin-token')
      .send({
        username: 'operario.b1',
        nombre: 'Operario',
        idRol: WmsRol.operario,
        idBodega: '550e8400-e29b-41d4-a716-446655440000',
        correo: 'operario@test.com',
        password: 'secret1',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.idUsuario).toBe('usr-new');
        expect(res.body.codigoCuenta).toBe('CTA001');
      });

    expect(usuariosService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'operario.b1',
        idRol: WmsRol.operario,
      }),
      adminContext,
    );
  });
});
