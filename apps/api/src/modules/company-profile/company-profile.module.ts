import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db.module';
import { CompanyProfileService } from './company-profile.service';
import { CompanyProfileController } from './company-profile.controller';

@Module({
  imports: [DbModule],
  controllers: [CompanyProfileController],
  providers: [CompanyProfileService],
  exports: [CompanyProfileService],
})
export class CompanyProfileModule {}
