import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '@thallesp/nestjs-better-auth';
import { DashboardStatsService } from './dashboard-stats.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardStatsController {
  constructor(private readonly dashboardStatsService: DashboardStatsService) {}

  @Get('stats')
  @Roles(['super_admin', 'admin'])
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard stats fetched successfully' })
  async getStats() {
    const stats = await this.dashboardStatsService.getStats();
    return {
      success: true,
      statusCode: 200,
      message: 'Dashboard stats fetched successfully',
      data: stats,
    };
  }
}