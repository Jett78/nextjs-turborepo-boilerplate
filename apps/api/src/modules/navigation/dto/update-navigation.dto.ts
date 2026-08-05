import { IsString, IsOptional, IsBoolean, IsInt, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNavigationDto {
  @ApiProperty({ required: false, example: 'Homepage' })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  label?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @ApiProperty({ required: false, example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
