import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTestimonialDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Excellent service and fresh products!' })
  @IsString()
  @MinLength(3)
  message: string;

  @ApiPropertyOptional({ example: 'customer-avatars/john.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar?: string;

  @ApiPropertyOptional({ example: 'CEO, NepalTech' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  designation?: string;
}
