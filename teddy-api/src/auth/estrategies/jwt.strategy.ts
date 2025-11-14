import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as JwtStrategyBase } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { JwtFromRequestFunction } from 'passport-jwt';
import type { Request } from 'express';

interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
  tenantId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const bearerTokenExtractor = ((req: Request | undefined) => {
  const authHeader = req?.headers?.authorization;
  if (typeof authHeader !== 'string') return null;
  const [type, token] = authHeader.split(' ');
  return type?.toLowerCase() === 'bearer' && token ? token : null;
}) satisfies JwtFromRequestFunction;

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtStrategyBase) {
  constructor(private readonly config: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      jwtFromRequest: bearerTokenExtractor,
      secretOrKey: config.get<string>('JWT_SECRET') ?? 'default_secret',
      ignoreExpiration: false,
    });
  }
  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      email: payload.email,
      tenantId: payload.tenantId,
    };
  }
}
