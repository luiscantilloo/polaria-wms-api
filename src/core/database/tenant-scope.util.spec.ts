import { ForbiddenException } from '@nestjs/common';
import { RolNivel, WmsRol } from '../../generated/prisma/client';
import type { TenantContext } from '../tenant/tenant-context.interface';
import {
  applyTenantFilter,
  assertOperationalTenantScope,
} from './tenant-scope.util';

const cuentaOperador: TenantContext = {
  idUsuario: 'usr-op',
  idRol: WmsRol.operador_cuenta,
  nivelRol: RolNivel.cuenta,
  codigoEmpresa: 'EMP001',
  codigoCuenta: 'CTA001',
  idBodegas: [],
};

const jefeBodega: TenantContext = {
  idUsuario: 'usr-jefe',
  idRol: WmsRol.jefe_bodega,
  nivelRol: RolNivel.bodega,
  codigoEmpresa: 'EMP001',
  codigoCuenta: 'CTA001',
  idBodegas: ['bodega-a'],
};

const configurador: TenantContext = {
  idUsuario: 'usr-config',
  idRol: WmsRol.configurador,
  nivelRol: RolNivel.plataforma,
  codigoEmpresa: null,
  codigoCuenta: null,
  idBodegas: [],
};

describe('tenant-scope.util', () => {
  describe('applyTenantFilter', () => {
    it('no añade filtros para configurador', () => {
      const where = { sku: 'ABC' };

      expect(applyTenantFilter(where, configurador)).toEqual({ sku: 'ABC' });
    });

    it('fuerza codigoCuenta para operador de cuenta', () => {
      const where = { sku: 'ABC' };

      expect(applyTenantFilter(where, cuentaOperador)).toEqual({
        sku: 'ABC',
        codigoCuenta: 'CTA001',
      });
    });

    it('fuerza idBodega para rol nivel bodega', () => {
      const where = { sku: 'ABC' };

      expect(applyTenantFilter(where, jefeBodega)).toEqual({
        sku: 'ABC',
        codigoCuenta: 'CTA001',
        idBodega: 'bodega-a',
      });
    });
  });

  describe('assertOperationalTenantScope', () => {
    it('permite configurador con cualquier cuenta', () => {
      expect(() =>
        assertOperationalTenantScope(configurador, {
          codigoCuenta: 'CTA_OTRA',
          idBodega: 'bodega-x',
        }),
      ).not.toThrow();
    });

    it('rechaza codigoCuenta ajeno al contexto del usuario (403)', () => {
      expect(() =>
        assertOperationalTenantScope(cuentaOperador, {
          codigoCuenta: 'CTA002',
          idBodega: 'bodega-a',
        }),
      ).toThrow(
        new ForbiddenException(
          'La cuenta indicada no pertenece a su contexto de tenant',
        ),
      );
    });

    it('rechaza idBodega no asignada para rol nivel bodega', () => {
      expect(() =>
        assertOperationalTenantScope(jefeBodega, {
          codigoCuenta: 'CTA001',
          idBodega: 'bodega-b',
        }),
      ).toThrow(
        new ForbiddenException(
          'La bodega indicada no está asignada al usuario',
        ),
      );
    });

    it('acepta payload alineado al contexto', () => {
      expect(() =>
        assertOperationalTenantScope(cuentaOperador, {
          codigoCuenta: 'CTA001',
          idBodega: 'bodega-a',
        }),
      ).not.toThrow();
    });
  });
});
