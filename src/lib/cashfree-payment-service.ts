import { prisma } from "./prisma";
import { creditsService } from "./credits-service";
import { getCreditPackage, calculateTotalCredits } from "./credit-packages";

// Cashfree API configuration
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID!;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;

// Determine API URL based on credentials or explicit environment variable
// If secret key contains 'prod', use production API, otherwise sandbox
const isProductionKey = CASHFREE_SECRET_KEY?.includes('_prod_');
const CASHFREE_API_URL = process.env.CASHFREE_API_URL || 
  (isProductionKey
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg");

export const paymentService = {
  /**
   * Create a Cashfree order for credit purchase
   */
  async createOrder(
    userId: string,
    packageId: string,
    userEmail: string,
    userName?: string
  ): Promise<{
    success: boolean;
    sessionId?: string;
    orderId?: string;
    amount?: number;
    error?: string;
  }> {
    try {
      const pkg = getCreditPackage(packageId);
      if (!pkg) {
        return { success: false, error: "Invalid package selected" };
      }

      const amount = pkg.price; // Cashfree uses rupees, not paise
      const totalCredits = calculateTotalCredits(packageId);

      // Generate a unique order ID
      const orderId = `order_${userId}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;

      // Check for recent pending orders (within last 5 minutes) to prevent duplicate orders
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recentPendingOrders = await prisma.payment.findMany({
        where: {
          userId,
          status: "PENDING",
          createdAt: { gte: fiveMinutesAgo },
        },
        orderBy: { createdAt: "desc" },
      });

      // Filter by packageId in the notes
      const recentPendingOrder = recentPendingOrders.find(
        (order) => (order.notes as any)?.packageId === packageId
      );

      // If there's a recent pending order, return it instead of creating a new one
      if (recentPendingOrder) {
        // Try to get the session ID from Cashfree
        try {
          const cashfreeResponse = await fetch(
            `${CASHFREE_API_URL}/orders/${recentPendingOrder.cashfreeOrderId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "x-client-id": CASHFREE_APP_ID,
                "x-client-secret": CASHFREE_SECRET_KEY,
                "x-api-version": "2023-08-01",
              },
            }
          );

          if (cashfreeResponse.ok) {
            const cashfreeOrder = await cashfreeResponse.json();
            if (cashfreeOrder.payment_session_id) {
              return {
                success: true,
                sessionId: cashfreeOrder.payment_session_id,
                orderId: recentPendingOrder.cashfreeOrderId,
                amount: recentPendingOrder.amount / 100,
              };
            }
          }
        } catch (error) {
          console.error("Error fetching existing order from Cashfree:", error);
          // Continue to create a new order if we can't fetch the existing one
        }
      }

      // Create Cashfree order
      const orderData = {
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: userId,
          customer_email: userEmail,
          customer_phone: "9999999999", // Dummy phone for test
          customer_name: userName || "Customer",
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/cashfree/callback`,
          notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/cashfree/webhook`,
        },
        order_note: `${pkg.name} - ${totalCredits} credits`,
      };

      const response = await fetch(`${CASHFREE_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Cashfree order creation failed:", error);
        console.error("API URL:", CASHFREE_API_URL);
        console.error("App ID:", CASHFREE_APP_ID ? "Set" : "Missing");
        console.error("Secret Key:", CASHFREE_SECRET_KEY ? `Set (${isProductionKey ? 'Production' : 'Sandbox'})` : "Missing");
        return { success: false, error: "Failed to create order" };
      }

      const order = await response.json();

      // Check if payment record already exists (to handle retries)
      const existingPayment = await prisma.payment.findUnique({
        where: { cashfreeOrderId: orderId },
      });

      // Save order to database only if it doesn't exist
      if (!existingPayment) {
        await prisma.payment.create({
          data: {
            userId,
            cashfreeOrderId: orderId,
            amount: amount * 100, // Store in paise for consistency
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
      }

      return {
        success: true,
        sessionId: order.payment_session_id,
        orderId: orderId,
        amount: amount,
      };
    } catch (error) {
      console.error("Error creating order:", error);
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
          "Content-Type": "application/json",
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
        },
      });

      if (!response.ok) {
        return { success: false, error: "Failed to verify payment" };
      }

      const orderStatus = await response.json();

      if (orderStatus.order_status !== "PAID") {
        return { success: false, error: "Payment not completed" };
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

      // Check if this paymentId is already used by another payment (race condition prevention)
      if (orderStatus.cf_order_id) {
        const existingPaymentWithSameId = await prisma.payment.findUnique({
          where: { cashfreePaymentId: orderStatus.cf_order_id },
        });

        if (
          existingPaymentWithSameId &&
          existingPaymentWithSameId.id !== payment.id
        ) {
          console.error(
            `Payment ID ${orderStatus.cf_order_id} already exists for a different payment record`
          );
          return {
            success: false,
            error: "Payment ID already exists",
          };
        }
      }

      // Update payment record with cashfreePaymentId if not already set
      // Use upsert pattern to avoid unique constraint errors
      const updateData: any = {
        status: "SUCCESS",
      };

      // Only update cashfreePaymentId if it's not already set
      if (!payment.cashfreePaymentId && orderStatus.cf_order_id) {
        updateData.cashfreePaymentId = orderStatus.cf_order_id;
      }

      try {
        await prisma.payment.update({
          where: { id: payment.id },
          data: updateData,
        });
      } catch (updateError: any) {
        // Handle unique constraint error gracefully (race condition with webhook)
        if (updateError.code === "P2002") {
          console.log(
            `Payment ${orderStatus.cf_order_id} already updated by webhook (race condition handled)`
          );
          // Just update status if needed
          const currentPayment = await prisma.payment.findUnique({
            where: { id: payment.id },
          });
          if (currentPayment?.status !== "SUCCESS") {
            await prisma.payment.update({
              where: { id: payment.id },
              data: { status: "SUCCESS" },
            });
          }
        } else {
          throw updateError;
        }
      }

      // Add credits to user account
      const result = await creditsService.addCredits(
        payment.userId,
        payment.credits,
        "CREDIT_PURCHASE",
        `Purchased ${payment.credits} credits`,
        {
          orderId,
          amount: payment.amount / 100,
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
