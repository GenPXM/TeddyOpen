import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({ status: 409, description: 'Email já registrado.' })
  async register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Solicitar redefinição de senha',
    description:
      'Gera um token de 6 caracteres e envia para o email do usuário (se existir).',
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description:
      'Resposta genérica informando que, se o email existir, o token foi enviado.',
  })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.service.requestPasswordReset(dto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Redefinir a senha usando o token',
    description:
      'Valida o token e redefine a senha do usuário, limpando o token do banco.',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso.' })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado.' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.service.resetPassword(dto);
  }
}
