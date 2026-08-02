import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AllowAnonymous, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { KhaltiService } from './khalti.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@ApiTags('khalti')
@ApiBearerAuth()
@Controller('khalti')
export class KhaltiController {
  private readonly logger = new Logger(KhaltiController.name);

  constructor(private readonly khaltiService: KhaltiService) {}

  @Post('initiate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate a Khalti payment' })
  @ApiResponse({ status: 200, description: 'Payment initiated successfully, returns payment URL' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async initiatePayment(
    @Body() dto: InitiatePaymentDto,
    @Session() session?: UserSession,
  ) {
    const userId = session?.user?.id;
    const result = await this.khaltiService.initiatePayment(dto, userId);
    return {
      success: true,
      statusCode: 200,
      message: 'Payment initiated successfully',
      data: result,
    };
  }

  @Post('verify')
  @AllowAnonymous()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify a Khalti payment after callback' })
  @ApiResponse({ status: 200, description: 'Payment verified successfully' })
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    const result = await this.khaltiService.verifyPayment(dto.pidx);
    return {
      success: true,
      statusCode: 200,
      message: `Payment status: ${result.status}`,
      data: result,
    };
  }

  @Get('callback')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Khalti payment callback (redirect URL)' })
  async handleCallback(
    @Query('pidx') pidx: string,
    @Query('status') status: string,
    @Query('transaction_id') transactionId: string,
    @Query('amount') amount: string,
    @Query('purchase_order_id') purchaseOrderId: string,
    @Query('purchase_order_name') purchaseOrderName: string,
  ) {
    this.logger.log(`Khalti callback received: pidx=${pidx}, status=${status}`);

    let verificationResult = null;
    if (pidx && status === 'Completed') {
      try {
        verificationResult = await this.khaltiService.verifyPayment(pidx);
      } catch (error) {
        this.logger.error('Callback verification failed', error);
      }
    }

    return {
      success: true,
      statusCode: 200,
      message: `Payment ${status}`,
      data: {
        pidx,
        status,
        transactionId,
        amount,
        purchaseOrderId,
        purchaseOrderName,
        verification: verificationResult,
      },
    };
  }

  @Get('order/:pidx')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Get order details by pidx' })
  @ApiResponse({ status: 200, description: 'Order fetched successfully' })
  async getOrder(@Query('pidx') pidx: string) {
    const order = await this.khaltiService.getOrderByPidx(pidx);
    if (!order) {
      return {
        success: true,
        statusCode: 200,
        message: 'Order not found',
        data: null,
      };
    }
    return {
      success: true,
      statusCode: 200,
      message: 'Order fetched successfully',
      data: order,
    };
  }
}
