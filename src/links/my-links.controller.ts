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

@UseGuards(JwtAuthGuard)
@Controller('me/links')
export class MyLinksController {
  constructor(private readonly service: LinksService) {}

  @Get()
  async list(
    @CurrentUser() user: { userId: string },
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
  ) {
    return this.service.listByOwner(
      Number(user.userId),
      Number(page),
      Number(pageSize),
    );
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: UpdateLinkDto,
  ) {
    return this.service.update(Number(user.userId), Number(id), dto);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.service.softDelete(Number(user.userId), Number(id));
  }
}
