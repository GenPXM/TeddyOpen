import { Body, Controller, Post } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly service: TenantsService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo tenant',
    description:
      'Cria um novo tenant (cliente/conta).',
  })
  @ApiResponse({ status: 201, description: 'Tenant criado com sucesso' })
  async create(@Body() dto: CreateTenantDto) {
    return this.service.create(dto);
  }
}
