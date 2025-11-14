import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from '../auth/estrategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt-auth.guard';
import { Tenant } from '../tenants/entities/tenant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Tenant]),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'default_secret'),
        signOptions: {
          expiresIn: Number(config.get('JWT_EXPIRES_IN', 86400)),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OptionalJwtAuthGuard],
  exports: [OptionalJwtAuthGuard],
})
export class AuthModule {}
