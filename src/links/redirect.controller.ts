import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { LinksService } from './links.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Redirect')
@Controller()
export class RedirectController {
  constructor(private readonly service: LinksService) {}

  @Get(':code')
  @Redirect(undefined, 302)
  @ApiOperation({
    summary: 'Redirecionar usando o código encurtado',
    description:
      'Recebe o código da URL encurtada na rota e redireciona para a URL original, contabilizando o clique.',
  })
  @ApiParam({
    name: 'code',
    example: 'aZbKq7',
    description: 'Código de 6 caracteres da URL encurtada',
  })
  @ApiResponse({
    status: 302,
    description: 'Redireciona para a URL de origem',
  })
  @ApiResponse({
    status: 404,
    description: 'Short URL not found',
  })
  async redirect(@Param('code') code: string) {
    const link = await this.service.findByCodeOrFail(code);
    await this.service.registerClick(link.id);
    return { url: link.originUrl };
  }
}
