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
import { TeamService } from './team.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamMemberEntity } from './entities/team-member.entity';

@ApiTags('team-members')
@Controller('team-members')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @Roles(['super_admin'])
  @ApiOperation({ summary: 'Create a new team member' })
  @ApiResponse({ status: 201, description: 'Team member created successfully', type: TeamMemberEntity })
  async create(@Body() dto: CreateTeamMemberDto) {
    const teamMember = await this.teamService.create(dto);
    return {
      success: true,
      statusCode: 201,
      message: 'Team member created successfully',
      data: new TeamMemberEntity(teamMember),
    };
  }

  @AllowAnonymous()
  @Get()
  @ApiOperation({ summary: 'Get all team members' })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    const result = await this.teamService.findAll({
      skip: skip ? parseInt(skip, 10) : 0,
      take: take ? parseInt(take, 10) : 10,
      search,
    });
    return {
      success: true,
      statusCode: 200,
      message: 'Team members fetched successfully',
      data: result.data.map((t) => new TeamMemberEntity(t)),
    };
  }

  @AllowAnonymous()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a team member by slug' })
  @ApiParam({ name: 'slug', description: 'Team member slug' })
  async findBySlug(@Param('slug') slug: string) {
    const teamMember = await this.teamService.findBySlug(slug);
    return {
      success: true,
      statusCode: 200,
      message: 'Team member fetched successfully',
      data: new TeamMemberEntity(teamMember),
    };
  }

  @AllowAnonymous()
  @Get(':id')
  @ApiOperation({ summary: 'Get a team member by ID' })
  @ApiParam({ name: 'id', description: 'Team member UUID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const teamMember = await this.teamService.findOne(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Team member fetched successfully',
      data: new TeamMemberEntity(teamMember),
    };
  }

  @Put(':id')
  @Roles(['super_admin'])
  @ApiOperation({ summary: 'Update a team member' })
  @ApiParam({ name: 'id', description: 'Team member UUID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTeamMemberDto,
  ) {
    const teamMember = await this.teamService.update(id, dto);
    return {
      success: true,
      statusCode: 200,
      message: 'Team member updated successfully',
      data: new TeamMemberEntity(teamMember),
    };
  }

  @Delete(':id')
  @Roles(['super_admin'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a team member' })
  @ApiParam({ name: 'id', description: 'Team member UUID' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.teamService.remove(id);
    return {
      success: true,
      statusCode: 200,
      message: result.message,
    };
  }
}
