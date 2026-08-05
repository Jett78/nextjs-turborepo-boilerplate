import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Put,
  Param, 
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { RequirePermissions } from '../../decorators/require-permissions.decorator';
import { PermissionService } from './permission.service';
import { AssignPermissionDto, SyncRolePermissionsDto } from './dto/assign-permission.dto';
import { PermissionEntity } from './entities/permission.entity';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @RequirePermissions('permission.read')
  @ApiOperation({ summary: 'Get all available permissions' })
  @ApiResponse({ status: 200, description: 'Permissions fetched successfully', type: [PermissionEntity] })
  async getAllPermissions() {
    const permissions = await this.permissionService.getAllPermissions();
    return {
      success: true,
      statusCode: 200,
      message: 'Permissions fetched successfully',
      data: permissions.map(p => new PermissionEntity(p)),
    };
  }

  @Get('roles')
  @RequirePermissions('permission.read')
  @ApiOperation({ summary: 'Get all roles with their permissions (for matrix UI)' })
  @ApiResponse({ status: 200, description: 'Role permissions map fetched successfully' })
  async getRolePermissionsMap() {
    const data = await this.permissionService.getRolePermissionsMap();
    return {
      success: true,
      statusCode: 200,
      message: 'Role permissions map fetched successfully',
      data,
    };
  }

  @Get('roles/:role')
  @RequirePermissions('permission.read')
  @ApiOperation({ summary: 'Get permissions for a specific role' })
  @ApiParam({ name: 'role', enum: ['admin', 'editor', 'manager', 'customer'] })
  @ApiResponse({ status: 200, description: 'Role permissions fetched successfully' })
  async getRolePermissions(@Param('role') role: string) {
    const permissions = await this.permissionService.getPermissionsByRole(role);
    return {
      success: true,
      statusCode: 200,
      message: `Permissions for ${role} fetched successfully`,
      data: permissions.map(p => new PermissionEntity(p)),
    };
  }

  @Post('roles/:role')
  @RequirePermissions('permission.edit')
  @ApiOperation({ summary: 'Assign a permission to a role' })
  @ApiParam({ name: 'role', enum: ['admin', 'editor', 'manager', 'customer'] })
  @ApiResponse({ status: 200, description: 'Permission assigned successfully' })
  async assignPermission(
    @Param('role') role: string,
    @Body() dto: AssignPermissionDto,
  ) {
    const result = await this.permissionService.assignPermissionToRole(role, dto.permissionKey);
    return {
      success: true,
      statusCode: 200,
      message: result.message,
    };
  }

  @Delete('roles/:role/permissions/:permissionId')
  @RequirePermissions('permission.edit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke a permission from a role' })
  @ApiParam({ name: 'role', enum: ['admin', 'editor', 'manager', 'customer'] })
  @ApiParam({ name: 'permissionId', description: 'Permission UUID' })
  @ApiResponse({ status: 200, description: 'Permission revoked successfully' })
  async revokePermission(
    @Param('role') role: string,
    @Param('permissionId') permissionId: string,
  ) {
    const result = await this.permissionService.revokePermissionFromRole(role, permissionId);
    return {
      success: true,
      statusCode: 200,
      message: result.message,
    };
  }

  @Put('roles/:role/sync')
  @RequirePermissions('permission.edit')
  @ApiOperation({ summary: 'Sync all permissions for a role (replaces existing)' })
  @ApiParam({ name: 'role', enum: ['admin', 'editor', 'manager', 'customer'] })
  @ApiResponse({ status: 200, description: 'Role permissions synced successfully' })
  async syncRolePermissions(
    @Param('role') role: string,
    @Body() dto: SyncRolePermissionsDto,
  ) {
    const result = await this.permissionService.syncRolePermissions(role, dto.permissionKeys);
    return {
      success: true,
      statusCode: 200,
      message: result.message,
      data: { assigned: result.assigned },
    };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user\'s permissions' })
  @ApiResponse({ status: 200, description: 'User permissions fetched successfully' })
  async getMyPermissions(@Session() session: UserSession) {
    if (!session?.user) {
      return {
        success: false,
        statusCode: 401,
        message: 'Not authenticated',
        data: [],
      };
    }

    const permissions = await this.permissionService.getUserPermissions(session.user.id);
    return {
      success: true,
      statusCode: 200,
      message: 'User permissions fetched successfully',
      data: permissions,
    };
  }
}
