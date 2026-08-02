import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPaymentDto {
  @ApiProperty({ example: 'bZQLD9wRVWo4CdESSfuSsB', description: 'Payment identifier from Khalti' })
  @IsString()
  @IsNotEmpty()
  pidx: string;
}
