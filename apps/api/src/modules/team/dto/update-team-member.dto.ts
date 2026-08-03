import { PartialType } from '@nestjs/swagger';
import { CreateTeamMemberDto } from './create-team-member.dto';
import { IsOptional, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTeamMemberDto extends PartialType(CreateTeamMemberDto) {
  @ApiPropertyOptional({ example: 2, description: 'New sort order - triggers swap if changed' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;
}
