import { Module } from '@nestjs/common';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';
import { InquiryRepository } from './inquiry.repository';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [InquiryController],
  providers: [InquiryService, InquiryRepository],
  exports: [InquiryService],
})
export class InquiryModule {}
