"use server";

import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type {  PaymentSettingsResponse, PaymentProviderStatusResponse } from "@/types/payment-settings";

export async function getPaymentSettings(provider: string) {
  try {
    const response = await apiClient<PaymentSettingsResponse>(
      `${API_ROUTES.PAYMENT_SETTINGS}/${provider}`,
      { isAuthenticated: true }
    );
    if (!response || !response.success || !response.data) return null;
    return response.data;
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    return null;
  }
}

export async function savePaymentSettings(provider: string, data: {
  secretKey: string;
  publicKey: string;
  apiUrl: string;
  environment?: string;
  isEnabled?: boolean;
}) {
  try {
    const response = await apiClient<PaymentSettingsResponse>(
      `${API_ROUTES.PAYMENT_SETTINGS}/${provider}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        isAuthenticated: true,
      }
    );
    return response;
  } catch (error: any) {
    console.error("Error saving payment settings:", error);
    throw error;
  }
}

export async function getPaymentProviderStatus(provider: string) {
  try {
    const response = await apiClient<PaymentProviderStatusResponse>(
      `${API_ROUTES.PAYMENT_SETTINGS}/${provider}/status`,
      { isAuthenticated: true }
    );
    if (!response || !response.success || !response.data) return null;
    return response.data;
  } catch (error) {
    console.error("Error checking payment provider status:", error);
    return null;
  }
}
