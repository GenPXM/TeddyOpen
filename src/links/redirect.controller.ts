import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { LinksService } from './links.service';

@Controller()
export class RedirectController {
  constructor(private readonly service: LinksService) {}

  @Get(':code')
  @Redirect(undefined, 302)
  async redirect(@Param('code') code: string) {
    const link = await this.service.findByCodeOrFail(code);
    await this.service.registerClick(link.id);
    return { url: link.originUrl };
  }
}
