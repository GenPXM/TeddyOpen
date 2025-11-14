import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ormConfigAsync } from './config/orm.config';
import { AuthModule } from './auth/auth.module';
import { LinksModule } from './links/links.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(ormConfigAsync),
    AuthModule,
    LinksModule,
  ],
})
export class AppModule {}
