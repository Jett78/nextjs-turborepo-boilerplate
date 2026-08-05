import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
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
import { NavigationService } from './navigation.service';
import { UpdateNavigationDto } from './dto/update-navigation.dto';
import { NavigationEntity } from './entities/navigation.entity';

@ApiTags('navigation')
@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @AllowAnonymous()
  @Get()
  @ApiOperation({ summary: 'Get all navigation items' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of records to skip', example: 0 })
  @ApiQuery({ name: 'take', required: false, type: Number, description: 'Number of records to take', example: 100 })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for label, path, or key' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
  ) {
    const result = await this.navigationService.findAll({
      skip: skip ? parseInt(skip, 10) : 0,
      take: take ? parseInt(take, 10) : 100,
      search,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    });
    return {
      success: true,
      statusCode: 200,
      message: 'Navigation items fetched successfully',
      data: result.data.map((item) => new NavigationEntity(item)),
    };
  }

  @AllowAnonymous()
  @Get(':id')
  @ApiOperation({ summary: 'Get a navigation item by ID' })
  @ApiParam({ name: 'id', description: 'Navigation item UUID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const item = await this.navigationService.findOne(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Navigation item fetched successfully',
      data: new NavigationEntity(item),
    };
  }

  @Put(':id')
  @RequirePermissions('navigation.edit')
  @ApiOperation({ summary: 'Update a navigation item' })
  @ApiParam({ name: 'id', description: 'Navigation item UUID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNavigationDto,
  ) {
    const item = await this.navigationService.update(id, dto);
    return {
      success: true,
      statusCode: 200,
      message: 'Navigation item updated successfully',
      data: new NavigationEntity(item),
    };
  }
}
