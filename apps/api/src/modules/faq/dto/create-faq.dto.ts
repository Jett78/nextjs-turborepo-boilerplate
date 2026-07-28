import { IsString, IsOptional, IsBoolean, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFaqDto {
  @ApiProperty({ example: 'What is your return policy?' })
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  question: string;

  @ApiProperty({ example: 'You can return any item within 30 days of purchase.' })
  @IsString()
  @MinLength(3)
  answer: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
