import { PartialType } from '@nestjs/swagger';
import { CreateRedirectDto } from './create-redirect.dto';
import { IsOptional, IsBoolean, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRedirectDto extends PartialType(CreateRedirectDto) {
  @ApiPropertyOptional({ example: true, description: 'Active status of the redirect' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 301, description: 'HTTP status code for the redirect', enum: [301, 302, 307, 308, 410] })
  @IsOptional()
  @IsIn([301, 302, 307, 308, 410], { message: 'statusCode must be one of: 301, 302, 307, 308, 410' })
  statusCode?: number;
}
