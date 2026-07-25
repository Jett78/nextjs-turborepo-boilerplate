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
  @Get('public')
  @ApiOperation({ summary: 'Get public SEO settings for frontend rendering' })
  @ApiResponse({ status: 200, description: 'Public SEO settings' })
  async findPublic() {
    const seo = await this.seoService.findPublic();
    return {
      success: true,
      statusCode: 200,
      message: 'Public SEO settings fetched successfully',
      data: seo,
    };
  }

  @Get()
  @Roles(['super_admin'])
  @ApiOperation({ summary: 'Get full SEO settings' })
  @ApiResponse({ status: 200, description: 'SEO settings fetched successfully', type: GlobalSeoEntity })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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
