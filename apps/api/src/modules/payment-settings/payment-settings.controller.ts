import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AllowAnonymous, Roles } from '@thallesp/nestjs-better-auth';
import { PaymentSettingsService } from './payment-settings.service';
import { UpdatePaymentSettingsDto } from './dto/update-payment-settings.dto';
import { PaymentSettingsEntity } from './entities/payment-settings.entity';

@ApiTags('payment-settings')
@ApiBearerAuth()
@Controller('payment-settings')
export class PaymentSettingsController {
  constructor(private readonly paymentSettingsService: PaymentSettingsService) {}

  @Get(':provider')
  @Roles(['super_admin'])
  @ApiOperation({ summary: 'Get payment settings for a provider' })
  @ApiResponse({ status: 200, description: 'Payment settings fetched successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findOne(@Param('provider') provider: string) {
    const settings = await this.paymentSettingsService.findByProvider(provider);
    if (!settings) {
      return {
        success: true,
        statusCode: 200,
        message: 'Payment settings not found',
        data: null,
      };
    }
    return {
      success: true,
      statusCode: 200,
      message: 'Payment settings fetched successfully',
      data: new PaymentSettingsEntity(settings),
    };
  }

  @Put(':provider')
  @Roles(['super_admin'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create or update payment settings' })
  @ApiResponse({ status: 200, description: 'Payment settings saved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async upsert(
    @Param('provider') provider: string,
    @Body() dto: UpdatePaymentSettingsDto,
  ) {
    const settings = await this.paymentSettingsService.upsert(provider, dto);
    return {
      success: true,
      statusCode: 200,
      message: 'Payment settings saved successfully',
      data: new PaymentSettingsEntity(settings!),
    };
  }

  @Get(':provider/status')
  @Roles(['super_admin'])
  @ApiOperation({ summary: 'Check if payment provider is configured and enabled' })
  @ApiResponse({ status: 200, description: 'Status checked successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async checkStatus(@Param('provider') provider: string) {
    const credentials = await this.paymentSettingsService.getCredentials(provider);
    return {
      success: true,
      statusCode: 200,
      message: 'Payment provider status checked',
      data: {
        configured: !!credentials,
        enabled: credentials !== null,
      },
    };
  }
}
