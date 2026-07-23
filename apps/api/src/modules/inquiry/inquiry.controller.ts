import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { InquiryService } from './inquiry.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiryEntity } from './entities/inquiry.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('inquiries')
@Controller('inquiries')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Submit an inquiry' })
  @ApiResponse({ status: 201, description: 'Inquiry submitted successfully', type: InquiryEntity })
  async create(@Body() dto: CreateInquiryDto) {
    const inquiry = await this.inquiryService.create(dto);
    return {
      success: true,
      statusCode: 201,
      message: 'Inquiry submitted successfully',
      data: new InquiryEntity(inquiry),
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all inquiries' })
  @ApiQuery({ name: 'skip', required: false, example: 0, description: 'Number of records to skip' })
  @ApiQuery({ name: 'take', required: false, example: 10, description: 'Number of records to take' })
  @ApiQuery({ name: 'search', required: false, example: '', description: 'Search by name, email or message' })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    const result = await this.inquiryService.findAll({
      skip: skip ? parseInt(skip, 10) : 0,
      take: take ? parseInt(take, 10) : 10,
      search,
    });
    return {
      success: true,
      statusCode: 200,
      message: 'Inquiries fetched successfully',
      data: {
        data: result.data.map((i) => new InquiryEntity(i)),
        total: result.total,
        skip: result.skip,
        take: result.take,
        hasMore: result.hasMore,
      },
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get an inquiry by ID' })
  @ApiParam({ name: 'id', description: 'Inquiry UUID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const inquiry = await this.inquiryService.findOne(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Inquiry fetched successfully',
      data: new InquiryEntity(inquiry),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an inquiry' })
  @ApiParam({ name: 'id', description: 'Inquiry UUID' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.inquiryService.remove(id);
    return {
      success: true,
      statusCode: 200,
      message: result.message,
    };
  }
}
