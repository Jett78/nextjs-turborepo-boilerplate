import { ApiProperty } from '@nestjs/swagger';

export class GlobalSeoEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  metaTitle: string | null;

  @ApiProperty()
  metaDescription: string | null;

  @ApiProperty()
  ogTitle: string | null;

  @ApiProperty()
  ogDescription: string | null;

  @ApiProperty()
  ogImageKey: string | null;

  @ApiProperty()
  gtmContainerId: string | null;

  @ApiProperty()
  googleSearchConsoleVerification: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<GlobalSeoEntity>) {
    Object.assign(this, partial);
  }
}
