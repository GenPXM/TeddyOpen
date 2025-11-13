import { Body, Controller, Post, Req } from '@nestjs/common';
import { LinksService } from '../links/links.service';
import { ShortenDto } from './dto/shorten.dto';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Links')
@Controller()
export class LinksController {
  constructor(private readonly service: LinksService) {}

  @Post('shorten')
  @ApiOperation({
    summary: 'Encurtar uma URL',
    description:
      'Recebe uma URL completa e retorna uma URL encurtada. Pode ser chamado sem autenticação; se houver usuário autenticado, o link será associado a ele.',
  })
  @ApiBody({
    type: ShortenDto,
    description: 'Dados necessários para encurtar uma URL',
    examples: {
      exemplo1: {
        summary: 'URL longa qualquer',
        value: {
          originUrl:
            'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'URL encurtada criada com sucesso',
    schema: {
      example: {
        id: 1,
        code: 'aZbKq7',
        shortUrl: 'http://localhost:3000/aZbKq7',
        originUrl:
          'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
      },
    },
  })
  @ApiBearerAuth()
  async shorten(
    @Body() dto: ShortenDto,
    @Req() req: Request & { user?: { userId: string } },
  ) {
    const ownerId = req.user?.userId ? Number(req.user.userId) : null;
    return this.service.shorten(dto, ownerId);
  }
}
