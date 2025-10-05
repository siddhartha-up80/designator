import { prisma } from "./prisma";
import { creditsService } from "./credits-service";
import { getCreditPackage, calculateTotalCredits } from "./credit-packages";

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID!;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;
const CASHFREE_API_URL = "https://sandbox.cashfree.com/pg"; // Use "https://api.cashfree.com/pg" for production

export const paymentService = {
  /**
   * Create a Cashfree order for credit purchase
   */
  async createOrder(
    userId: string,
    packageId: string,
    userEmail: string,
    userName: string
  ): Promise<{
    success: boolean;
    sessionId?: string;
    orderId?: string;
    amount?: number;
    currency?: string;
    error?: string;
  }> {
    try {
      const pkg = getCreditPackage(packageId);
      if (!pkg) {
        return { success: false, error: "Invalid package selected" };
      }

      // Amount in paise (₹1 = 100 paise)
      const amount = pkg.price * 100;
      const totalCredits = calculateTotalCredits(packageId);
      const orderId = `order_${userId}_${Date.now()}`;

      // Create Cashfree order via API
      const response = await fetch(`${CASHFREE_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
        },
        body: JSON.stringify({
          order_id: orderId,
          order_amount: pkg.price, // Cashfree expects rupees, not paise
          order_currency: "INR",
          customer_details: {
            customer_id: userId,
            customer_email: userEmail,
            customer_phone: "9999999999", // You can make this dynamic
            customer_name: userName,
          },
          order_meta: {
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback?order_id=${orderId}`,
          },
          order_note: `${pkg.name} - ${totalCredits} credits`,
        }),
      });

      const orderData = await response.json();

      if (!response.ok || !orderData.payment_session_id) {
        console.error("Cashfree order creation failed:", orderData);
        return {
          success: false,
          error: orderData.message || "Failed to create order",
        };
      }

      // Save order to database
      await prisma.payment.create({
        data: {
          userId,
          cashfreeOrderId: orderId,
          amount,
          credits: totalCredits,
          currency: "INR",
          status: "PENDING",
          notes: {
            packageId,
            packageName: pkg.name,
            baseCredits: pkg.credits,
            bonusCredits: pkg.bonus,
          },
        },
      });

      return {
        success: true,
        sessionId: orderData.payment_session_id,
        orderId,
        amount,
        currency: "INR",
      };
    } catch (error) {
      console.error("Error creating Cashfree order:", error);
      return {
        success: false,
        error: "Failed to create order",
      };
    }
  },

  /**
   * Verify payment and add credits to user account
   */
  async verifyPayment(orderId: string): Promise<{
    success: boolean;
    credits?: number;
    error?: string;
  }> {
    try {
      // Get order status from Cashfree
      const response = await fetch(`${CASHFREE_API_URL}/orders/${orderId}`, {
        method: "GET",
        headers: {
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
        },
      });

      const orderData = await response.json();

      if (!response.ok) {
        console.error("Cashfree verification failed:", orderData);
        return { success: false, error: "Failed to verify payment" };
      }

      // Find payment record
      const payment = await prisma.payment.findUnique({
        where: { cashfreeOrderId: orderId },
      });

      if (!payment) {
        return { success: false, error: "Payment record not found" };
      }

      // Check if already processed
      if (payment.status === "SUCCESS") {
        return {
          success: true,
          credits: payment.credits,
        };
      }

      // Check payment status
      if (orderData.order_status !== "PAID") {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "FAILED" },
        });
        return {
          success: false,
          error: `Payment ${orderData.order_status.toLowerCase()}`,
        };
      }

      // Update payment record
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          cashfreePaymentId: orderData.cf_order_id || orderId,
          status: "SUCCESS",
        },
      });

      // Add credits to user account
      const result = await creditsService.addCredits(
        payment.userId,
        payment.credits,
        "CREDIT_PURCHASE",
        `Purchased ${payment.credits} credits`,
        {
          paymentId: orderData.cf_order_id,
          orderId,
          amount: payment.amount / 100, // Convert paise to rupees
        }
      );

      if (!result.success) {
        // Rollback payment status
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "FAILED" },
        });

        return {
          success: false,
          error: "Failed to add credits",
        };
      }

      return {
        success: true,
        credits: payment.credits,
      };
    } catch (error) {
      console.error("Error verifying payment:", error);
      return {
        success: false,
        error: "Payment verification failed",
      };
    }
  },

  /**
   * Get payment history for user
   */
  async getPaymentHistory(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const payments = await prisma.payment.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return payments.map((payment) => ({
        id: payment.id,
        orderId: payment.cashfreeOrderId,
        paymentId: payment.cashfreePaymentId,
        amount: payment.amount / 100, // Convert to rupees
        credits: payment.credits,
        status: payment.status,
        packageName: (payment.notes as any)?.packageName || "Unknown",
        createdAt: payment.createdAt,
      }));
    } catch (error) {
      console.error("Error fetching payment history:", error);
      return [];
    }
  },

  /**
   * Handle failed payment
   */
  async handleFailedPayment(orderId: string): Promise<void> {
    try {
      await prisma.payment.update({
        where: { cashfreeOrderId: orderId },
        data: { status: "FAILED" },
      });
    } catch (error) {
      console.error("Error handling failed payment:", error);
    }
  },
};
