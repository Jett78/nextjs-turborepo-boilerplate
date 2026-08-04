import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AllowAnonymous, Roles } from '@thallesp/nestjs-better-auth';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { GalleryEntity } from './entities/gallery.entity';

@ApiTags('gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @Roles(['super_admin'])
  @ApiOperation({ summary: 'Create a new gallery item' })
  @ApiResponse({ status: 201, description: 'Gallery item created successfully', type: GalleryEntity })
  async create(@Body() dto: CreateGalleryDto) {
    const item = await this.galleryService.create(dto);
    return {
      success: true,
      statusCode: 201,
      message: 'Gallery item created successfully',
      data: new GalleryEntity(item),
    };
  }

  @AllowAnonymous()
  @Get()
  @ApiOperation({ summary: 'Get all gallery items' })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    const result = await this.galleryService.findAll({
      skip: skip ? parseInt(skip, 10) : 0,
      take: take ? parseInt(take, 10) : 10,
      search,
      category,
    });
    return {
      success: true,
      statusCode: 200,
      message: 'Gallery items fetched successfully',
      data: result.data.map((item) => new GalleryEntity(item)),
    };
  }

  @AllowAnonymous()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a gallery item by slug' })
  @ApiParam({ name: 'slug', description: 'Gallery item slug' })
  async findBySlug(@Param('slug') slug: string) {
    const item = await this.galleryService.findBySlug(slug);
    return {
      success: true,
      statusCode: 200,
      message: 'Gallery item fetched successfully',
      data: new GalleryEntity(item),
    };
  }

  @AllowAnonymous()
  @Get(':id')
  @ApiOperation({ summary: 'Get a gallery item by ID' })
  @ApiParam({ name: 'id', description: 'Gallery item UUID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const item = await this.galleryService.findOne(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Gallery item fetched successfully',
      data: new GalleryEntity(item),
    };
  }

  @Put(':id')
  @Roles(['super_admin'])
  @ApiOperation({ summary: 'Update a gallery item' })
  @ApiParam({ name: 'id', description: 'Gallery item UUID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGalleryDto,
  ) {
    const item = await this.galleryService.update(id, dto);
    return {
      success: true,
      statusCode: 200,
      message: 'Gallery item updated successfully',
      data: new GalleryEntity(item),
    };
  }

  @Delete(':id')
  @Roles(['super_admin'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a gallery item' })
  @ApiParam({ name: 'id', description: 'Gallery item UUID' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.galleryService.remove(id);
    return {
      success: true,
      statusCode: 200,
      message: result.message,
    };
  }
}
