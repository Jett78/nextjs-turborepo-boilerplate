import { IsString, IsNumber, IsOptional, IsObject, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InitiatePaymentDto {
  @ApiProperty({ example: 1000, description: 'Amount in NPR (will be converted to paisa)' })
  @IsNumber()
  @Min(10)
  amount: number;

  @ApiProperty({ example: 'product-123', description: 'Unique product/order identifier' })
  @IsString()
  @MinLength(1)
  productId: string;

  @ApiProperty({ example: 'Premium Package', description: 'Product name for display' })
  @IsString()
  @MinLength(1)
  productName: string;

  @ApiProperty({ example: 'https://localhost:3000/payment/success' })
  @IsString()
  returnUrl: string;

  @ApiProperty({ example: 'https://localhost:3000' })
  @IsString()
  websiteUrl: string;

  @ApiPropertyOptional({
    example: { name: 'Khalti Bahadur', email: 'test@gmail.com', phone: '9800000123' },
  })
  @IsOptional()
  @IsObject()
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}
