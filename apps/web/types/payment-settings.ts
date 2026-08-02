import { CommonResponse } from "./base-entity";

export interface PaymentSettings {
  id: string;
  provider: string;
  secretKey: string;
  publicKey: string;
  apiUrl: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentSettingsResponse = CommonResponse<PaymentSettings>;

export interface PaymentProviderStatus {
  configured: boolean;
  enabled: boolean;
}

export type PaymentProviderStatusResponse = CommonResponse<PaymentProviderStatus>;
