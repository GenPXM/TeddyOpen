import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { LinksService } from './links.service';
import { UpdateLinkDto } from './dto/update-link.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('My Links')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me/links')
export class MyLinksController {
  constructor(private readonly service: LinksService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar URLs encurtadas do usuário autenticado',
    description:
      'Retorna uma lista paginada de URLs encurtadas pertencentes ao usuário logado, incluindo a quantidade de cliques.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Número da página (opcional, padrão = 1)',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    example: 20,
    description: 'Quantidade de itens por página (opcional, padrão = 20)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de links do usuário',
  })
  async list(
    @CurrentUser() user: { userId: string, tenantId: number },
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
  ) {
    return this.service.listByOwner(
      Number(user.userId),
      Number(user.tenantId),
      Number(page),
      Number(pageSize),
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar URL de destino de um link encurtado',
    description:
      'Permite alterar a URL de origem de um link encurtado pertencente ao usuário autenticado.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID numérico do link encurtado',
  })
  @ApiBody({
    type: UpdateLinkDto,
    description: 'Campos permitidos para atualização do link',
  })
  @ApiResponse({ status: 200, description: 'Link atualizado com sucesso' })
  @ApiResponse({ status: 403, description: 'Link não pertence ao usuário' })
  @ApiResponse({ status: 404, description: 'Link não encontrado' })
  async update(
    @CurrentUser() user: { userId: string, tenantId: number },
    @Param('id') id: string,
    @Body() dto: UpdateLinkDto,
  ) {
    return this.service.update(
      Number(user.tenantId),
      Number(user.userId),
      Number(id),
      dto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Excluir (soft delete) um link encurtado do usuário',
    description:
      'Marca o link como excluído (deletedAt), sem removê-lo fisicamente do banco.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID numérico do link encurtado',
  })
  @ApiResponse({ status: 200, description: 'Link excluído com sucesso' })
  @ApiResponse({ status: 403, description: 'Link não pertence ao usuário' })
  @ApiResponse({ status: 404, description: 'Link não encontrado' })
  async remove(
    @CurrentUser() user: { userId: string, tenantId: number },
    @Param('id') id: string,
  ) {
    return this.service.softDelete(
      Number(user.tenantId),
      Number(user.userId),
      Number(id),
    );
  }
}
