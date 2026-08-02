import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePaymentSettingsDto {
  @ApiPropertyOptional({ example: 'khalti' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  provider?: string;

  @ApiProperty({ example: 'f1f901abd92f4bb98515d73a25aee910' })
  @IsString()
  secretKey: string;

  @ApiProperty({ example: '9803627f53d14b879d60ce53cb962ad1' })
  @IsString()
  publicKey: string;

  @ApiProperty({ example: 'https://a.khalti.com/api/v2' })
  @IsString()
  @MaxLength(500)
  apiUrl: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
