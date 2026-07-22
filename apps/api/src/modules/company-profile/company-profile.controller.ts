import {
  Controller,
  Get,
  Put,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CompanyProfileService } from './company-profile.service';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { CompanyProfileEntity } from './entities/company-profile.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('company-profile')
@Controller('company-profile')
export class CompanyProfileController {
  constructor(private readonly companyProfileService: CompanyProfileService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get company profile' })
  @ApiResponse({ status: 200, description: 'Company profile fetched successfully', type: CompanyProfileEntity })
  async findOne() {
    const profile = await this.companyProfileService.findOne();
    return {
      success: true,
      statusCode: 200,
      message: 'Company profile fetched successfully',
      data: profile,
    };
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update company profile' })
  @ApiResponse({ status: 200, description: 'Company profile updated successfully', type: CompanyProfileEntity })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async update(@Body() dto: UpdateCompanyProfileDto) {
    const profile = await this.companyProfileService.update(dto);
    return {
      success: true,
      statusCode: 200,
      message: 'Company profile updated successfully',
      data: profile,
    };
  }
}
