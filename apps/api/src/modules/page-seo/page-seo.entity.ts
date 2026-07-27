import { ApiProperty } from '@nestjs/swagger';

export class PageSeoEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  pagePath: string;

  @ApiProperty()
  pageTitle: string | null;

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
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<PageSeoEntity>) {
    Object.assign(this, partial);
  }
}
