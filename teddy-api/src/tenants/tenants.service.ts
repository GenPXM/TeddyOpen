import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
  ) {}

  async create(dto: CreateTenantDto) {
    const exists = await this.tenants.findOne({
      where: { slug: dto.slug },
    });

    if (exists) {
      throw new ConflictException('Slug de tenant já está em uso');
    }

    const tenant = this.tenants.create(dto);
    await this.tenants.save(tenant);
    return tenant;
  }

  async findById(id: number) {
    return this.tenants.findOne({ where: { id } });
  }
}
