import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DB_CONNECTION } from '../../db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import { PaymentSettingsService } from '../payment-settings/payment-settings.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import * as crypto from 'crypto';


interface KhaltiLookupResponse {
  pidx: string;
  total_amount: number;
  status: string;
  transaction_id: string | null;
  fee: number;
  refunded: boolean;
  detail?: string;
}

@Injectable()
export class KhaltiService {
  private readonly logger = new Logger(KhaltiService.name);

  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly paymentSettingsService: PaymentSettingsService,
  ) {}

  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(8).toString('hex');
    return `ORD-${timestamp}-${random}`;
  }

  async initiatePayment(dto: InitiatePaymentDto, userId?: string) {
    const credentials = await this.paymentSettingsService.getCredentials('khalti');
    if (!credentials) {
      throw new BadRequestException('Khalti payment is not configured. Please set up payment credentials in the admin dashboard.');
    }

    const purchaseOrderId = this.generateOrderId();

    // Create pending order in database
    const [order] = await this.db
      .insert(schema.orders)
      .values({
        orderId: purchaseOrderId,
        userId: userId || null,
        productName: dto.productName,
        productId: dto.productId,
        amount: dto.amount,
        status: 'pending',
        customerName: dto.customerInfo?.name,
        customerEmail: dto.customerInfo?.email,
        customerPhone: dto.customerInfo?.phone,
      })
      .returning();

    this.logger.log(`Order created: ${purchaseOrderId}`);

    const payload = {
      return_url: dto.returnUrl,
      website_url: dto.websiteUrl,
      amount: dto.amount * 100, // Convert NPR to paisa
      purchase_order_id: purchaseOrderId,
      purchase_order_name: dto.productName,
      customer_info: dto.customerInfo || {},
    };

    this.logger.log(`Initiating Khalti payment for order ${purchaseOrderId}`);

    try {
      const response = await fetch(`${credentials.apiUrl}/epayment/initiate/`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${credentials.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        this.logger.error('Khalti initiate failed', data);
        // Update order status to failed
        await this.db
          .update(schema.orders)
          .set({ status: 'failed', updatedAt: new Date() })
          .where(eq(schema.orders.id, order.id));
        throw new BadRequestException(data.detail || data.message || 'Khalti payment initiation failed');
      }

      // Store pidx in order for later verification
      await this.db
        .update(schema.orders)
        .set({ pidx: data.pidx, updatedAt: new Date() })
        .where(eq(schema.orders.id, order.id));

      this.logger.log(`Khalti payment initiated: pidx=${data.pidx}`);

      return {
        pidx: data.pidx,
        payment_url: data.payment_url,
        expires_at: data.expires_at,
        expires_in: data.expires_in,
        purchase_order_id: purchaseOrderId,
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error('Khalti API error', error);
      // Update order status to failed
      await this.db
        .update(schema.orders)
        .set({ status: 'failed', updatedAt: new Date() })
        .where(eq(schema.orders.id, order.id));
      throw new BadRequestException('Failed to connect to Khalti payment gateway');
    }
  }

  async verifyPayment(pidx: string) {
    const credentials = await this.paymentSettingsService.getCredentials('khalti');
    if (!credentials) {
      throw new BadRequestException('Khalti payment is not configured');
    }

    this.logger.log(`Verifying Khalti payment: pidx=${pidx}`);

    try {
      const response = await fetch(`${credentials.apiUrl}/epayment/lookup/`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${credentials.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pidx }),
      });

      const data: KhaltiLookupResponse = await response.json();

      if (!response.ok) {
        this.logger.error('Khalti lookup failed', data);
        throw new BadRequestException(data.detail || 'Payment verification failed');
      }

      this.logger.log(`Khalti payment status: ${data.status}`);

      // Update order status in database
      const [order] = await this.db
        .select()
        .from(schema.orders)
        .where(eq(schema.orders.pidx, pidx))
        .limit(1);

      if (order) {
        const statusMap: Record<string, typeof order.status> = {
          'Completed': 'completed',
          'Pending': 'pending',
          'Refunded': 'refunded',
          'Expired': 'expired',
          'User canceled': 'cancelled',
        };

        const newStatus = statusMap[data.status] || 'pending';

        await this.db
          .update(schema.orders)
          .set({
            status: newStatus,
            transactionId: data.transaction_id,
            paymentMethod: 'khalti',
            updatedAt: new Date(),
          })
          .where(eq(schema.orders.id, order.id));

        this.logger.log(`Order ${order.orderId} updated to status: ${newStatus}`);
      }

      return {
        pidx: data.pidx,
        totalAmount: data.total_amount,
        status: data.status,
        transactionId: data.transaction_id,
        fee: data.fee,
        refunded: data.refunded,
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error('Khalti verification API error', error);
      throw new BadRequestException('Failed to verify payment with Khalti');
    }
  }

  async getOrderByPidx(pidx: string) {
    const [order] = await this.db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.pidx, pidx))
      .limit(1);

    return order || null;
  }

  async getOrderByOrderId(orderId: string) {
    const [order] = await this.db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.orderId, orderId))
      .limit(1);

    return order || null;
  }
}
