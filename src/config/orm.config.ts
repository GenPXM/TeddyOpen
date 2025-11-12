import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const ormConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  useFactory: async () => {
    const ssl = process.env.DB_SSL === 'true';
    return {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
      ssl: ssl ? { rejectUnauthorized: false } : false,
      logging: false,
    } as DataSourceOptions;
  },
};
