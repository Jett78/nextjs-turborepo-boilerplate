import { ApiProperty } from '@nestjs/swagger';
import { BlogEntity } from '../entities/blog.entity';

export class PaginatedBlogDto {
  @ApiProperty({ type: [BlogEntity] })
  data: BlogEntity[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 0 })
  skip: number;

  @ApiProperty({ example: 10 })
  take: number;

  @ApiProperty({ example: true })
  hasMore: boolean;
}
