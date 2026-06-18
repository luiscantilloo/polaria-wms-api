import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './env.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
