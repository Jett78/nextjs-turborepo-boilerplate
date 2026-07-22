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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { GetBlogsQueryDto } from './dto/get-blogs-query.dto';
import { BlogEntity } from './entities/blog.entity';
import { PaginatedBlogDto } from './dto/paginated-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('blogs')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new blog',
    description: 'Create a new blog post. Requires super_admin role.',
  })
  @ApiResponse({ status: 201, description: 'Blog created successfully', type: BlogEntity })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token' })
  @ApiForbiddenResponse({ description: 'Forbidden - Requires super_admin role' })
  async create(@Body() createBlogDto: CreateBlogDto) {
    const blog = await this.blogService.create(createBlogDto);
    return {
      success: true,
      statusCode: 201,
      message: 'Blog created successfully',
      data: new BlogEntity(blog),
    };
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all blogs with pagination' })
  @ApiResponse({ status: 200, description: 'Blogs fetched successfully', type: PaginatedBlogDto })
  async findAll(@Query() query: GetBlogsQueryDto) {
    const result = await this.blogService.findAll(query);
    return {
      success: true,
      statusCode: 200,
      message: 'Blogs fetched successfully',
      data: {
        data: result.data.map((blog) => new BlogEntity(blog)),
        total: result.total,
        skip: result.skip,
        take: result.take,
        hasMore: result.hasMore,
      },
    };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a blog by ID' })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 200, description: 'Blog fetched successfully', type: BlogEntity })
  @ApiNotFoundResponse({ description: 'Blog not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const blog = await this.blogService.findOne(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Blog fetched successfully',
      data: new BlogEntity(blog),
    };
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a blog by slug' })
  @ApiParam({ name: 'slug', description: 'Blog slug' })
  @ApiResponse({ status: 200, description: 'Blog fetched successfully', type: BlogEntity })
  @ApiNotFoundResponse({ description: 'Blog not found' })
  async findBySlug(@Param('slug') slug: string) {
    const blog = await this.blogService.findBySlug(slug);
    return {
      success: true,
      statusCode: 200,
      message: 'Blog fetched successfully',
      data: new BlogEntity(blog),
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update a blog',
    description: 'Update an existing blog post. Requires super_admin role.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 200, description: 'Blog updated successfully', type: BlogEntity })
  @ApiNotFoundResponse({ description: 'Blog not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token' })
  @ApiForbiddenResponse({ description: 'Forbidden - Requires super_admin role' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    const blog = await this.blogService.update(id, updateBlogDto);
    return {
      success: true,
      statusCode: 200,
      message: 'Blog updated successfully',
      data: new BlogEntity(blog),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a blog',
    description: 'Delete a blog post. Requires super_admin role.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 200, description: 'Blog deleted successfully' })
  @ApiNotFoundResponse({ description: 'Blog not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token' })
  @ApiForbiddenResponse({ description: 'Forbidden - Requires super_admin role' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.blogService.remove(id);
    return {
      success: true,
      statusCode: 200,
      message: result.message,
    };
  }
}
