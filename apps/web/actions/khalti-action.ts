"use server";

import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/config/api-routes";
import type { InitiatePaymentRequest, InitiatePaymentResponse, VerifyPaymentResponse } from "@/types/khalti";

export async function initiateKhaltiPayment(data: InitiatePaymentRequest) {
  try {
    const response = await apiClient<InitiatePaymentResponse>(
      `${API_ROUTES.KHALTI}/initiate`,
      {
        method: "POST",
        body: JSON.stringify(data),
        isAuthenticated: true,
      }
    );
    return response;
  } catch (error: any) {
    console.error("Error initiating Khalti payment:", error);
    throw error;
  }
}

export async function verifyKhaltiPayment(pidx: string) {
  try {
    const response = await apiClient<VerifyPaymentResponse>(
      `${API_ROUTES.KHALTI}/verify`,
      {
        method: "POST",
        body: JSON.stringify({ pidx }),
      }
    );
    return response;
  } catch (error: any) {
    console.error("Error verifying Khalti payment:", error);
    throw error;
  }
}
