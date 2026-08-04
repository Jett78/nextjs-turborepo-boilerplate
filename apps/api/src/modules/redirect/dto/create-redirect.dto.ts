import { IsString, Matches, MaxLength, MinLength, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRedirectDto {
  @ApiProperty({ example: '/old-page', description: 'Source path to redirect from' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @Matches(/^\//, { message: 'fromPath must start with a forward slash' })
  fromPath: string;

  @ApiProperty({ example: '/new-page', description: 'Destination path to redirect to' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @Matches(/^\//, { message: 'toPath must start with a forward slash' })
  toPath: string;

  @ApiPropertyOptional({ example: 301, description: 'HTTP status code for the redirect', enum: [301, 302, 307, 308, 410] })
  @IsOptional()
  @IsIn([301, 302, 307, 308, 410], { message: 'statusCode must be one of: 301, 302, 307, 308, 410' })
  statusCode?: number;
}
