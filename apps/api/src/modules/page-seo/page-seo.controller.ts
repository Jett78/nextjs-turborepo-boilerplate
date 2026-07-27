import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { AllowAnonymous, Roles } from '@thallesp/nestjs-better-auth';
import { PageSeoService } from './page-seo.service';
import { CreatePageSeoDto, UpdatePageSeoDto } from './dto/page-seo.dto';
import { PageSeoEntity } from './page-seo.entity';

@ApiTags('page-seo')
@Controller('page-seo')
export class PageSeoController {
  constructor(private readonly pageSeoService: PageSeoService) {}

  @AllowAnonymous()
  @Get(':path')
  @ApiOperation({ summary: 'Get SEO settings for a specific page' })
  @ApiParam({ name: 'path', example: '/about' })
  @ApiResponse({ status: 200, description: 'Page SEO fetched successfully', type: PageSeoEntity })
  async findByPath(@Param('path') path: string) {
    const seo = await this.pageSeoService.findByPath(path);
    return {
      success: true,
      statusCode: 200,
      message: 'Page SEO fetched successfully',
      data: seo,
    };
  }

  @Get()
  @Roles(['super_admin'])
  @ApiOperation({ summary: 'Get all page SEO entries' })
  @ApiResponse({ status: 200, description: 'All page SEO entries', type: [PageSeoEntity] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findAll() {
    const pages = await this.pageSeoService.findAll();
    return {
      success: true,
      statusCode: 200,
      message: 'Page SEO entries fetched successfully',
      data: pages,
    };
  }

  @Post()
  @Roles(['super_admin'])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create page SEO' })
  @ApiResponse({ status: 201, description: 'Page SEO created successfully', type: PageSeoEntity })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(@Body() dto: CreatePageSeoDto) {
    const page = await this.pageSeoService.upsert(dto.pagePath!, dto);
    return {
      success: true,
      statusCode: 201,
      message: 'Page SEO created successfully',
      data: page,
    };
  }

  @Put(':path')
  @Roles(['super_admin'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update page SEO' })
  @ApiParam({ name: 'path', example: '/about' })
  @ApiResponse({ status: 200, description: 'Page SEO updated successfully', type: PageSeoEntity })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async update(@Param('path') path: string, @Body() dto: UpdatePageSeoDto) {
    const page = await this.pageSeoService.upsert(path, dto);
    return {
      success: true,
      statusCode: 200,
      message: 'Page SEO updated successfully',
      data: page,
    };
  }

  @Delete(':path')
  @Roles(['super_admin'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete page SEO' })
  @ApiParam({ name: 'path', example: '/about' })
  @ApiResponse({ status: 200, description: 'Page SEO deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param('path') path: string) {
    await this.pageSeoService.remove(path);
    return {
      success: true,
      statusCode: 200,
      message: 'Page SEO deleted successfully',
    };
  }
}
