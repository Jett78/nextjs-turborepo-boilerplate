import { CommonResponse } from "./base-entity";

export interface InitiatePaymentRequest {
  amount: number;
  productId: string;
  productName: string;
  returnUrl: string;
  websiteUrl: string;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface InitiatePaymentData {
  pidx: string;
  payment_url: string;
  expires_at: string;
  expires_in: number;
  purchase_order_id: string;
}

export type InitiatePaymentResponse = CommonResponse<InitiatePaymentData>;

export interface VerifyPaymentRequest {
  pidx: string;
}

export interface VerifyPaymentData {
  pidx: string;
  totalAmount: number;
  status: string;
  transactionId: string | null;
  fee: number;
  refunded: boolean;
}

export type VerifyPaymentResponse = CommonResponse<VerifyPaymentData>;

export interface Order {
  id: string;
  orderId: string;
  pidx: string | null;
  userId: string | null;
  productName: string;
  productId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string | null;
  transactionId: string | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderResponse = CommonResponse<Order>;

export interface KhaltiCallbackData {
  pidx: string;
  status: string;
  transactionId: string;
  amount: string;
  purchaseOrderId: string;
  purchaseOrderName: string;
  verification: VerifyPaymentData | null;
}

export type KhaltiCallbackResponse = CommonResponse<KhaltiCallbackData>;
