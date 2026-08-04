import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
