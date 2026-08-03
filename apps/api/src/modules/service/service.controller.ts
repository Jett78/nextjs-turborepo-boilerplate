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
} from '@nestjs/swagger';
import { AllowAnonymous, Roles } from '@thallesp/nestjs-better-auth';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceEntity } from './entities/service.entity';

@ApiTags('services')
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @Roles(['super_admin'])
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully', type: ServiceEntity })
  async create(@Body() dto: CreateServiceDto) {
    const service = await this.serviceService.create(dto);
    return {
      success: true,
      statusCode: 201,
      message: 'Service created successfully',
      data: new ServiceEntity(service),
    };
  }

  @AllowAnonymous()
  @Get()
  @ApiOperation({ summary: 'Get all services' })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    const result = await this.serviceService.findAll({
      skip: skip ? parseInt(skip, 10) : 0,
      take: take ? parseInt(take, 10) : 10,
      search,
    });
    return {
      success: true,
      statusCode: 200,
      message: 'Services fetched successfully',
      data: result.data.map((s) => new ServiceEntity(s)),
    };
  }

  @AllowAnonymous()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a service by slug' })
  @ApiParam({ name: 'slug', description: 'Service slug' })
  async findBySlug(@Param('slug') slug: string) {
    const service = await this.serviceService.findBySlug(slug);
    return {
      success: true,
      statusCode: 200,
      message: 'Service fetched successfully',
      data: new ServiceEntity(service),
    };
  }

  @AllowAnonymous()
  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiParam({ name: 'id', description: 'Service UUID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const service = await this.serviceService.findOne(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Service fetched successfully',
      data: new ServiceEntity(service),
    };
  }

  @Put(':id')
  @Roles(['super_admin'])
  @ApiOperation({ summary: 'Update a service' })
  @ApiParam({ name: 'id', description: 'Service UUID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    const service = await this.serviceService.update(id, dto);
    return {
      success: true,
      statusCode: 200,
      message: 'Service updated successfully',
      data: new ServiceEntity(service),
    };
  }

  @Delete(':id')
  @Roles(['super_admin'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a service' })
  @ApiParam({ name: 'id', description: 'Service UUID' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.serviceService.remove(id);
    return {
      success: true,
      statusCode: 200,
      message: result.message,
    };
  }
}
