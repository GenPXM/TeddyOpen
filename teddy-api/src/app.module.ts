import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ormConfigAsync } from './config/orm.config';
import { AuthModule } from './auth/auth.module';
import { LinksModule } from './links/links.module';
import { TenantsModule } from './tenants/tenants.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(ormConfigAsync),
    TenantsModule,
    AuthModule,
    LinksModule,

  ],
})
export class AppModule {}
