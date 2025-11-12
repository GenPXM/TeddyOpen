import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Link } from './entities/link.entity';
import { Click } from './entities/click.entity';
import { ShortenDto } from './dto/shorten.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { randomBytes } from 'crypto';

const ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function randomCode(length = 6): string {
  const buf = randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) out += ALPHABET[buf[i] % ALPHABET.length];
  return out;
}

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link) private readonly links: Repository<Link>,
    @InjectRepository(Click) private readonly clicks: Repository<Click>,
  ) {}

  private async generateUniqueCode(): Promise<string> {
    for (let i = 0; i < 5; i++) {
      const code = randomCode(6);
      const exists = await this.links.findOne({
        where: { code, deletedAt: IsNull() },
      });
      if (!exists) return code;
    }
    throw new BadRequestException('Could not generate unique code');
  }

  async shorten(dto: ShortenDto, ownerId?: string | null) {
    const code = await this.generateUniqueCode();
    const link = this.links.create({
      originUrl: dto.originUrl,
      code,
      ownerId: ownerId ?? null,
    });
    await this.links.save(link);
    const shortUrl = `${process.env.APP_BASE_URL}/${code}`;
    return { id: link.id, code, shortUrl, originUrl: link.originUrl };
  }

  async findByCodeOrFail(code: string) {
    const link = await this.links.findOne({
      where: { code, deletedAt: IsNull() },
    });
    if (!link) throw new NotFoundException('Short URL not found');
    return link;
  }

  async registerClick(linkId: string) {
    await this.links.increment({ id: linkId }, 'clicks', 1);
    await this.clicks.insert({ linkId });
  }

  async listByOwner(ownerId: string, page = 1, pageSize = 20) {
    const [items, total] = await this.links.findAndCount({
      where: { ownerId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      page,
      pageSize,
      total,
      items: items.map((l) => ({
        id: l.id,
        code: l.code,
        originUrl: l.originUrl,
        clicks: l.clicks,
        shortUrl: `${process.env.APP_BASE_URL}/${l.code}`,
        createdAt: l.createdAt,
        updatedAt: l.updatedAt,
      })),
    };
  }

  async update(ownerId: string, id: string, dto: UpdateLinkDto) {
    const link = await this.links.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!link) throw new NotFoundException('Link not found');
    if (link.ownerId !== ownerId) throw new ForbiddenException();

    if (dto.originUrl) link.originUrl = dto.originUrl;
    await this.links.save(link);
    return { id: link.id, code: link.code, originUrl: link.originUrl };
  }

  async softDelete(ownerId: string, id: string) {
    const link = await this.links.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!link) throw new NotFoundException('Link not found');
    if (link.ownerId !== ownerId) throw new ForbiddenException();

    link.deletedAt = new Date();
    await this.links.save(link);
    return { success: true };
  }
}
