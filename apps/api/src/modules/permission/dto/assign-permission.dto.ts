import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionDto {
  @ApiProperty({ example: 'blog.create', description: 'Permission key to assign' })
  @IsString()
  @IsNotEmpty()
  permissionKey: string;
}

export class BulkAssignPermissionsDto {
  @ApiProperty({ 
    example: ['blog.read', 'blog.create', 'blog.edit'], 
    description: 'Array of permission keys to assign' 
  })
  @IsArray()
  @IsString({ each: true })
  permissionKeys: string[];
}

export class SyncRolePermissionsDto {
  @ApiProperty({ 
    example: ['blog.read', 'blog.create', 'service.read'], 
    description: 'Complete list of permission keys for the role (replaces existing)' 
  })
  @IsArray()
  @IsString({ each: true })
  permissionKeys: string[];
}
