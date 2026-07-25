import {
  Controller,
  Get,
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
import { SeoService } from './seo.service';
import { UpdateGlobalSeoDto } from './dto/update-seo.dto';
import { GlobalSeoEntity } from './seo.entity';

@ApiTags('seo')
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @AllowAnonymous()
  @Get()
  @ApiOperation({ summary: 'Get SEO settings' })
  @ApiResponse({ status: 200, description: 'SEO settings fetched successfully', type: GlobalSeoEntity })
  async findOne() {
    const seo = await this.seoService.findOne();
    return {
      success: true,
      statusCode: 200,
      message: 'SEO settings fetched successfully',
      data: seo,
    };
  }

  @Put()
  @Roles(['super_admin'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update SEO settings' })
  @ApiResponse({ status: 200, description: 'SEO settings updated successfully', type: GlobalSeoEntity })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async upsert(@Body() dto: UpdateGlobalSeoDto) {
    const seo = await this.seoService.upsert(dto);
    return {
      success: true,
      statusCode: 200,
      message: 'SEO settings updated successfully',
      data: seo,
    };
  }
}
