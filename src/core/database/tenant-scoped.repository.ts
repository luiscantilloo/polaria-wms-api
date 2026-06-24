import type { TenantContext } from '../tenant/tenant-context.interface';
import {
  applyTenantFilter,
  assertOperationalTenantScope,
  type OperationalTenantPayload,
} from './tenant-scope.util';

/**
 * Base reusable para repositorios de tablas operativas (POL-33).
 * Fuerza filtros tenant en lecturas y validación de scope en escrituras.
 */
export abstract class TenantScopedRepository {
  protected scopedWhere<W extends Record<string, unknown>>(
    where: W,
    ctx: TenantContext,
  ): W {
    return applyTenantFilter(where, ctx);
  }

  protected assertScope(
    ctx: TenantContext,
    payload: OperationalTenantPayload,
  ): void {
    assertOperationalTenantScope(ctx, payload);
  }
}
