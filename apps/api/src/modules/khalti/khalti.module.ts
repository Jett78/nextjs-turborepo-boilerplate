import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db.module';
import { PaymentSettingsModule } from '../payment-settings/payment-settings.module';
import { KhaltiService } from './khalti.service';
import { KhaltiController } from './khalti.controller';

@Module({
  imports: [DbModule, PaymentSettingsModule],
  controllers: [KhaltiController],
  providers: [KhaltiService],
  exports: [KhaltiService],
})
export class KhaltiModule {}
