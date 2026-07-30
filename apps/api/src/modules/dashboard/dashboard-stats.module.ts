import { Module } from '@nestjs/common';
import { DashboardStatsController } from './dashboard-stats.controller';
import { DashboardStatsService } from './dashboard-stats.service';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [DashboardStatsController],
  providers: [DashboardStatsService],
})
export class DashboardStatsModule {}