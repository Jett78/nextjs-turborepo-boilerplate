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
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { RequirePermissions } from '../../decorators/require-permissions.decorator';
import { TestimonialService } from './testimonial.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { TestimonialEntity } from './entities/testimonial.entity';

@ApiTags('testimonials')
@Controller('testimonials')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Post()
  @RequirePermissions('testimonial.create')
  @ApiOperation({ summary: 'Create a new testimonial' })
  @ApiResponse({ status: 201, description: 'Testimonial created successfully', type: TestimonialEntity })
  async create(@Body() dto: CreateTestimonialDto) {
    const testimonial = await this.testimonialService.create(dto);
    return {
      success: true,
      statusCode: 201,
      message: 'Testimonial created successfully',
      data: new TestimonialEntity(testimonial),
    };
  }

  @AllowAnonymous()
  @Get()
  @ApiOperation({ summary: 'Get all testimonials' })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    const result = await this.testimonialService.findAll({
      skip: skip ? parseInt(skip, 10) : 0,
      take: take ? parseInt(take, 10) : 10,
      search,
    });
    return {
      success: true,
      statusCode: 200,
      message: 'Testimonials fetched successfully',
      data: result.data.map((t) => new TestimonialEntity(t)),
    };
  }

  @AllowAnonymous()
  @Get(':id')
  @ApiOperation({ summary: 'Get a testimonial by ID' })
  @ApiParam({ name: 'id', description: 'Testimonial UUID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const testimonial = await this.testimonialService.findOne(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Testimonial fetched successfully',
      data: new TestimonialEntity(testimonial),
    };
  }

  @Put(':id')
  @RequirePermissions('testimonial.edit')
  @ApiOperation({ summary: 'Update a testimonial' })
  @ApiParam({ name: 'id', description: 'Testimonial UUID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTestimonialDto,
  ) {
    const testimonial = await this.testimonialService.update(id, dto);
    return {
      success: true,
      statusCode: 200,
      message: 'Testimonial updated successfully',
      data: new TestimonialEntity(testimonial),
    };
  }

  @Delete(':id')
  @RequirePermissions('testimonial.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a testimonial' })
  @ApiParam({ name: 'id', description: 'Testimonial UUID' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.testimonialService.remove(id);
    return {
      success: true,
      statusCode: 200,
      message: result.message,
    };
  }
}
