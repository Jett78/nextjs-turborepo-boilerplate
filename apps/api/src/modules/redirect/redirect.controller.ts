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
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { RequirePermissions } from '../../decorators/require-permissions.decorator';
import { RedirectService } from './redirect.service';
import { CreateRedirectDto } from './dto/create-redirect.dto';
import { UpdateRedirectDto } from './dto/update-redirect.dto';
import { RedirectEntity } from './entities/redirect.entity';

@ApiTags('redirects')
@Controller('redirects')
export class RedirectController {
  constructor(private readonly redirectService: RedirectService) {}

  @Post()
  @RequirePermissions('redirect.create')
  @ApiOperation({ summary: 'Create a new redirect' })
  @ApiResponse({ status: 201, description: 'Redirect created successfully', type: RedirectEntity })
  async create(@Body() dto: CreateRedirectDto) {
    const redirect = await this.redirectService.create(dto);
    return {
      success: true,
      statusCode: 201,
      message: 'Redirect created successfully',
      data: new RedirectEntity(redirect),
    };
  }

  @Get()
  @RequirePermissions('redirect.read')
  @ApiOperation({ summary: 'Get all redirects (admin)' })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    const result = await this.redirectService.findAll({
      skip: skip ? parseInt(skip, 10) : 0,
      take: take ? parseInt(take, 10) : 10,
      search,
    });
    return {
      success: true,
      statusCode: 200,
      message: 'Redirects fetched successfully',
      data: {
        data: result.data.map((r) => new RedirectEntity(r)),
        total: result.total,
        skip: result.skip,
        take: result.take,
        hasMore: result.hasMore,
      },
    };
  }

  @AllowAnonymous()
  @Get('all')
  @ApiOperation({ summary: 'Get all active redirects (public - for middleware)' })
  async findAllActive() {
    const redirects = await this.redirectService.findAllActive();
    return {
      success: true,
      statusCode: 200,
      message: 'Active redirects fetched successfully',
      data: redirects.map((r) => ({
        fromPath: r.fromPath,
        toPath: r.toPath,
        statusCode: r.statusCode ?? 301,
      })),
    };
  }

  @AllowAnonymous()
  @Get(':id')
  @ApiOperation({ summary: 'Get a redirect by ID' })
  @ApiParam({ name: 'id', description: 'Redirect UUID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const redirect = await this.redirectService.findOne(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Redirect fetched successfully',
      data: new RedirectEntity(redirect),
    };
  }

  @Put(':id')
  @RequirePermissions('redirect.edit')
  @ApiOperation({ summary: 'Update a redirect' })
  @ApiParam({ name: 'id', description: 'Redirect UUID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRedirectDto,
  ) {
    const redirect = await this.redirectService.update(id, dto);
    return {
      success: true,
      statusCode: 200,
      message: 'Redirect updated successfully',
      data: new RedirectEntity(redirect),
    };
  }

  @Delete(':id')
  @RequirePermissions('redirect.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a redirect' })
  @ApiParam({ name: 'id', description: 'Redirect UUID' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.redirectService.remove(id);
    return {
      success: true,
      statusCode: 200,
      message: result.message,
    };
  }
}
