import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db.module';
import { SeoService } from './seo.service';
import { SeoController } from './seo.controller';

@Module({
  imports: [DbModule],
  controllers: [SeoController],
  providers: [SeoService],
  exports: [SeoService],
})
export class SeoModule {}
