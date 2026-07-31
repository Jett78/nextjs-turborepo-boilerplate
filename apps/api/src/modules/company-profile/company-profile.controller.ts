import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AllowAnonymous, Roles } from '@thallesp/nestjs-better-auth';
import { CompanyProfileService } from './company-profile.service';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { CompanyProfileEntity } from './entities/company-profile.entity';

@ApiTags('company-profile')
@Controller('company-profile')
export class CompanyProfileController {
  constructor(private readonly companyProfileService: CompanyProfileService) {}

  @AllowAnonymous()
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

  @Post()
  @Roles(['super_admin'])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create company profile' })
  @ApiResponse({ status: 201, description: 'Company profile created successfully', type: CompanyProfileEntity })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(@Body() dto: UpdateCompanyProfileDto) {
    const profile = await this.companyProfileService.create(dto);
    return {
      success: true,
      statusCode: 201,
      message: 'Company profile created successfully',
      data: profile,
    };
  }

  @Put()
  @Roles(['super_admin'])
  @HttpCode(HttpStatus.OK)
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
