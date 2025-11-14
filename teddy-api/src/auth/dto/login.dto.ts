import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha do usuário',
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'teddy',
    description: 'Slug do tenant ao qual o usuário pertence',
  })
  @IsString()
  tenantSlug: string;
}
