import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db.module';
import { PageSeoService } from './page-seo.service';
import { PageSeoController } from './page-seo.controller';

@Module({
  imports: [DbModule],
  controllers: [PageSeoController],
  providers: [PageSeoService],
  exports: [PageSeoService],
})
export class PageSeoModule {}
