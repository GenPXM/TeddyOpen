import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Número da página (deve ser >= 1)',
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 20,
    description: 'Quantidade de itens por página (deve ser >= 1)',
    default: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number = 20;
}
