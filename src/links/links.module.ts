import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { Click } from './entities/click.entity';
import { LinksService } from '../links/links.service';
import { LinksController } from '../links/links.controller';
import { MyLinksController } from '../links/my-links.controller';
import { RedirectController } from '../links/redirect.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Link, Click])],
  controllers: [LinksController, MyLinksController, RedirectController],
  providers: [LinksService],
})
export class LinksModule {}
