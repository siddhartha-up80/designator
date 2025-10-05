// Payment related TypeScript types

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  userId: string;
  cashfreeOrderId: string;
  cashfreePaymentId?: string;
  amount: number; // in paise
  credits: number;
  currency: string;
  status: PaymentStatus;
  receipt: string;
  notes?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  packageId: string;
}

export interface CreateOrderResponse {
  sessionId: string;
  orderId: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentRequest {
  orderId: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  credits?: number;
  message?: string;
}

export interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  returnUrl: string;
}

// Extend Window interface for Cashfree
declare global {
  interface Window {
    Cashfree: any;
  }
}
