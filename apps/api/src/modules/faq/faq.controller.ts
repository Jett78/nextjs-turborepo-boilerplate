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
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { RequirePermissions } from '../../decorators/require-permissions.decorator';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqEntity } from './entities/faq.entity';

@ApiTags('faqs')
@Controller('faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  @RequirePermissions('faq.create')
  @ApiOperation({ summary: 'Create a new FAQ' })
  @ApiResponse({ status: 201, description: 'FAQ created successfully', type: FaqEntity })
  async create(@Body() dto: CreateFaqDto) {
    const faq = await this.faqService.create(dto);
    return {
      success: true,
      statusCode: 201,
      message: 'FAQ created successfully',
      data: new FaqEntity(faq),
    };
  }

  @AllowAnonymous()
  @Get()
  @ApiOperation({ summary: 'Get all FAQs' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of records to skip', example: 0 })
  @ApiQuery({ name: 'take', required: false, type: Number, description: 'Number of records to take', example: 100 })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for question or answer' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
  ) {
    const result = await this.faqService.findAll({
      skip: skip ? parseInt(skip, 10) : 0,
      take: take ? parseInt(take, 10) : 100,
      search,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    });
    return {
      success: true,
      statusCode: 200,
      message: 'FAQs fetched successfully',
      data: result.data.map((f) => new FaqEntity(f)),
    };
  }

  @AllowAnonymous()
  @Get(':id')
  @ApiOperation({ summary: 'Get a FAQ by ID' })
  @ApiParam({ name: 'id', description: 'FAQ UUID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const faq = await this.faqService.findOne(id);
    return {
      success: true,
      statusCode: 200,
      message: 'FAQ fetched successfully',
      data: new FaqEntity(faq),
    };
  }

  @Put(':id')
  @RequirePermissions('faq.edit')
  @ApiOperation({ summary: 'Update a FAQ' })
  @ApiParam({ name: 'id', description: 'FAQ UUID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFaqDto,
  ) {
    const faq = await this.faqService.update(id, dto);
    return {
      success: true,
      statusCode: 200,
      message: 'FAQ updated successfully',
      data: new FaqEntity(faq),
    };
  }

  @Delete(':id')
  @RequirePermissions('faq.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a FAQ' })
  @ApiParam({ name: 'id', description: 'FAQ UUID' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.faqService.remove(id);
    return {
      success: true,
      statusCode: 200,
      message: result.message,
    };
  }
}
