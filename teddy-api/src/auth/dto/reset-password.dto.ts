import { IsEmail, IsInt, IsString, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 1,
    description: 'ID do tenant ao qual o usuário pertence',
  })
  @IsInt()
  tenantId: number;

  @ApiProperty({
    example: 'A1B2C3',
    description: 'Token de 6 caracteres enviado por email',
  })
  @IsString()
  @Length(6, 6)
  token: string;

  @ApiProperty({
    example: 'novaSenha123',
    description: 'Nova senha do usuário (mínimo 6 caracteres)',
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
