import { IsOptional, IsUrl, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLinkDto {
  @ApiPropertyOptional({
    example: 'https://meu-novo-endereco.com/alguma/coisa',
    description: 'Nova URL de destino para o link encurtado',
  })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  originUrl?: string;
}
