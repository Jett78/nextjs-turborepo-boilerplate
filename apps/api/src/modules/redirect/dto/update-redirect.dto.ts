import { PartialType } from '@nestjs/swagger';
import { CreateRedirectDto } from './create-redirect.dto';
import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRedirectDto extends PartialType(CreateRedirectDto) {
  @ApiPropertyOptional({ example: true, description: 'Active status of the redirect' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
