import { get } from "@/lib/api";

export interface PaymentStatusResponse {
  success: boolean;
  data?: {
    id: string;
    paymentType: string;
    amount: string;
    currency: string;
    result: {
      code: string;
      description: string;
    };
    resultDetails?: {
      ResponseCode?: string;
      AuthCode?: string;
      clearingInstituteName?: string;
      LastFourDigits?: string;
      CardType?: string;
    };
    merchantTransactionId?: string;
    registrationId?: string;
    timestamp: string;
  };
  error?: string;
}

export async function getPaymentStatus(resourcePath: string): Promise<PaymentStatusResponse> {
  return get<PaymentStatusResponse>(`/api/payments/status?resourcePath=${encodeURIComponent(resourcePath)}`);
}

export async function verifyPayment(paymentId: string): Promise<PaymentStatusResponse> {
  return get<PaymentStatusResponse>(`/api/payments/verify/${paymentId}`);
}
