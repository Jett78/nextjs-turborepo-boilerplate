import { ApiProperty } from '@nestjs/swagger';

export class PermissionEntity {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'blog' })
  resource: string;

  @ApiProperty({ example: 'create' })
  action: string;

  @ApiProperty({ example: 'blog.create' })
  key: string;

  @ApiProperty({ example: 'Create new blogs' })
  description: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<PermissionEntity>) {
    Object.assign(this, partial);
  }
}
