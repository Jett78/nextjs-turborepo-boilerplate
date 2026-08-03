import { IsString, IsOptional, MaxLength, MinLength, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamMemberDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: 'Senior Developer' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  designation?: string;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  joinedDate?: string;

  @ApiPropertyOptional({ example: 'Passionate about building great software.' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ example: 'team-avatars/john.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar?: string;

  @ApiPropertyOptional({ example: 'https://wa.me/1234567890' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  whatsappUrl?: string;

  @ApiPropertyOptional({ example: 'john-doe', description: 'Auto-generated from name if not provided' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  slug?: string;
}
