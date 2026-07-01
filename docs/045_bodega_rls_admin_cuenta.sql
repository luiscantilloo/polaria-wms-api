-- 045: Permitir INSERT/UPDATE en bodega a administrador_cuenta (scope cuenta)
-- Alinea bodega con producto, cliente, proveedor, planta, camion, comprador.
-- Antes solo existían bodega_insert_configurador / bodega_update_configurador.

CREATE POLICY bodega_insert_cuenta
  ON public.bodega
  FOR INSERT
  TO authenticated
  WITH CHECK (auth_wms_puede_gestionar_catalogo_cuenta(codigo_cuenta));

CREATE POLICY bodega_update_cuenta
  ON public.bodega
  FOR UPDATE
  TO authenticated
  USING (auth_wms_puede_gestionar_catalogo_cuenta(codigo_cuenta))
  WITH CHECK (auth_wms_puede_gestionar_catalogo_cuenta(codigo_cuenta));
