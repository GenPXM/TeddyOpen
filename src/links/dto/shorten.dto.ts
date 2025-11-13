import { IsUrl, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShortenDto {
  @ApiProperty({
    example:
      'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
    description: 'URL completa que será encurtada (precisa ter http/https)',
  })
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  originUrl: string;
}
