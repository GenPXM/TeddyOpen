import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { LinksService } from './links.service';

@Controller()
export class RedirectController {
  constructor(private readonly service: LinksService) {}

  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: Response) {
    const link = await this.service.findByCodeOrFail(code);
    await this.service.registerClick(link.id);
    return res.redirect(302, link.originUrl);
  }
}
