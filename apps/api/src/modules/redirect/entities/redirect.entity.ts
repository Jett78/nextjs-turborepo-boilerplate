import { ApiProperty } from '@nestjs/swagger';

export class RedirectEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fromPath: string;

  @ApiProperty()
  toPath: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Record<string, any>) {
    this.id = partial.id;
    this.fromPath = partial.fromPath;
    this.toPath = partial.toPath;
    this.isActive = partial.isActive;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
  }
}
