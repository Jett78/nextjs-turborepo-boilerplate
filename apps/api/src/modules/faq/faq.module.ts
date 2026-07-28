import { Module } from '@nestjs/common';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
import { FaqRepository } from './faq.repository';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [FaqController],
  providers: [FaqService, FaqRepository],
  exports: [FaqService],
})
export class FaqModule {}
