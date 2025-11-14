import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({
    example: 'Teddy 360',
    description: 'Nome do tenant/cliente',
  })
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    example: 'teddy',
    description: 'Slug único usado para identificar o tenant',
  })
  @IsString()
  @MaxLength(100)
  slug: string;
}
