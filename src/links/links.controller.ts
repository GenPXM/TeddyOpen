import { Body, Controller, Post, Req } from '@nestjs/common';
import { LinksService } from '../links/links.service';
import { ShortenDto } from './dto/shorten.dto';
import { Request } from 'express';

@Controller()
export class LinksController {
  constructor(private readonly service: LinksService) {}

  @Post('shorten')
  async shorten(
    @Body() dto: ShortenDto,
    @Req() req: Request & { user?: { userId: string } },
  ) {
    const ownerId = req.user?.userId ? Number(req.user.userId) : null;
    return this.service.shorten(dto, ownerId);
  }
}
