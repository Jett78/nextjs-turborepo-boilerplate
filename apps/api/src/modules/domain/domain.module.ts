import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DomainController } from './domain.controller';
import { DomainService } from './domain.service';
import { DnsVerificationService } from './dns-verification.service';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [DbModule, ConfigModule],
  controllers: [DomainController],
  providers: [DomainService, DnsVerificationService],
  exports: [DomainService],
})
export class DomainModule {}
