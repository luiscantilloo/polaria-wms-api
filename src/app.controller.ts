import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAGS } from './core/swagger/swagger.constants';
import { AppService } from './app.service';

@ApiTags(SWAGGER_TAGS.SISTEMA)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check básico' })
  @ApiOkResponse({
    description: 'Mensaje de bienvenida de la API',
    schema: { type: 'string', example: 'Hello World!' },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
