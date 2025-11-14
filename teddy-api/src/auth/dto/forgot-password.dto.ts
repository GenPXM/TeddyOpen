import { IsEmail, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email do usuário que deseja redefinir a senha',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 1,
    description: 'ID do tenant ao qual o usuário pertence',
  })
  @IsInt()
  tenantId: number;
}
