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
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
    private readonly jwt: JwtService,
    private readonly mailService: MailService,
  ) {}
  private generateResetToken(length = 6): string {
    const alphabet =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return token;
  }

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
  async requestPasswordReset(dto: ForgotPasswordDto) {
    const tenant = await this.tenants.findOne({
      where: { id: dto.tenantId },
    });

    if (!tenant) {
      throw new BadRequestException('Tenant inválido');
    }

    const user = await this.users.findOne({
      where: {
        email: dto.email,
        tenant: { id: tenant.id },
      },
      relations: ['tenant'],
    });
    if (!user) {
      return {
        message:
          'Se este email estiver cadastrado, um token de redefinição será enviado.',
      };
    }

    const token = this.generateResetToken(6);
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    user.resetToken = token;
    user.resetTokenExpiresAt = expires;
    await this.users.save(user);

    await this.mailService.sendPasswordResetEmail({
      to: user.email,
      token,
      tenantName: tenant.name,
    });

    return {
      message:
        'Se este email estiver cadastrado, um token de redefinição foi enviado.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tenant = await this.tenants.findOne({
      where: { id: dto.tenantId },
    });

    if (!tenant) {
      throw new BadRequestException('Tenant inválido');
    }

    const user = await this.users.findOne({
      where: {
        email: dto.email,
        tenant: { id: tenant.id },
      },
      relations: ['tenant'],
    });

    if (!user || !user.resetToken || !user.resetTokenExpiresAt) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    const now = new Date();
    if (
      user.resetToken !== dto.token ||
      user.resetTokenExpiresAt.getTime() < now.getTime()
    ) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiresAt = null;

    await this.users.save(user);

    return {
      message: 'Senha redefinida com sucesso',
    };
  }
}
