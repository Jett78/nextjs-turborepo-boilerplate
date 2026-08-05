import { ApiProperty } from '@nestjs/swagger';

export class NavigationEntity {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'home' })
  key: string;

  @ApiProperty({ example: 'Home' })
  label: string;

  @ApiProperty({ example: '/' })
  path: string;

  @ApiProperty({ example: 1 })
  sortOrder: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<NavigationEntity>) {
    Object.assign(this, partial);
  }
}
