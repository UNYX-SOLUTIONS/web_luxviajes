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

export interface TransactionStatusResponse {
  success: boolean;
  data?: {
    checkoutId?: string | null;
    merchantTransactionId: string;
    status: string;
    paymentId?: string | null;
    resultCode?: string | null;
    resultDescription?: string | null;
  };
  error?: string;
}

export async function getTransactionStatus(checkoutId: string): Promise<TransactionStatusResponse> {
  return get<TransactionStatusResponse>(`/api/payments/transaction-status?checkoutId=${encodeURIComponent(checkoutId)}`);
}

export async function verifyPayment(paymentId: string): Promise<PaymentStatusResponse> {
  return get<PaymentStatusResponse>(`/api/payments/verify/${paymentId}`);
}
