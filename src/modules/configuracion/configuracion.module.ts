import { Module } from '@nestjs/common';
import { BodegaController } from './controllers/bodega.controller';
import { BodegaLayoutController } from './controllers/bodega-layout.controller';
import { BodegaRepository } from './infrastructure/bodega.repository';
import { BodegaLayoutRepository } from './infrastructure/bodega-layout.repository';
import { BodegaService } from './services/bodega.service';
import { BodegaLayoutBootstrapService } from './services/bodega-layout-bootstrap.service';

@Module({
  controllers: [BodegaController, BodegaLayoutController],
  providers: [
    BodegaService,
    BodegaRepository,
    BodegaLayoutBootstrapService,
    BodegaLayoutRepository,
  ],
})
export class ConfiguracionModule {}
