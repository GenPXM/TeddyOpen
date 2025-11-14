import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Tenant } from '../tenants/entities/tenant.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const tenant = await this.tenants.findOne({
      where: { id: dto.tenantId },
    });

    if (!tenant) {
      throw new BadRequestException('Tenant inválido');
    }

    const exists = await this.users.findOne({
      where: {
        email: dto.email,
        tenant: { id: tenant.id },
      },
      relations: ['tenant'],
    });

    if (exists) {
      throw new ConflictException(
        'Já existe um usuário com este e-mail neste tenant',
      );
    }

    const user = this.users.create({
      email: dto.email,
      password: dto.password,
      tenant,
    });

    await this.users.save(user);

    return {
      id: user.id,
      email: user.email,
      tenantId: tenant.id,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findOne({
      where: { email: dto.email },
      relations: ['tenant'],
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      tenantId: user.tenant?.id,
    });

    return { access_token: token };
  }
}
