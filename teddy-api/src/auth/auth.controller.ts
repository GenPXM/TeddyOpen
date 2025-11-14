import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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
}
