import { Module } from '@nestjs/common';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';
import { RedirectRepository } from './redirect.repository';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [RedirectController],
  providers: [RedirectService, RedirectRepository],
  exports: [RedirectService],
})
export class RedirectModule {}
