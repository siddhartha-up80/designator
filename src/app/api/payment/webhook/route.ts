import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/payment-service";
import { creditsService } from "@/lib/credits-service";
import { prisma } from "@/lib/prisma";

/**
 * Cashfree Webhook Handler
 * This endpoint receives real-time notifications from Cashfree
 * Configure this URL in Cashfree Dashboard > Developers > Webhooks
 * URL: https://yourdomain.com/api/payment/webhook
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body.type;
    // Handle different event types
    switch (eventType) {
      case "PAYMENT_SUCCESS_WEBHOOK":
        await handlePaymentSuccess(body.data);
        break;

      case "PAYMENT_FAILED_WEBHOOK":
        await handlePaymentFailed(body.data);
        break;

      case "PAYMENT_USER_DROPPED_WEBHOOK":
        await handlePaymentDropped(body.data);
        break;

      default:
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment webhook
 */
async function handlePaymentSuccess(data: any) {
  try {
    const orderId = data.order?.order_id;
    const paymentId = data.payment?.cf_payment_id;

    if (!orderId) {
      console.error("No order ID in webhook data");
      return;
    }
    // Find payment record
    const payment = await prisma.payment.findUnique({
      where: { cashfreeOrderId: orderId },
    });

    if (!payment) {
      console.error(`Payment record not found for order: ${orderId}`);
      return;
    }

    // Check if already processed
    if (payment.status === "SUCCESS") {
      return;
    }

    // Check if this paymentId is already used (race condition prevention)
    if (paymentId) {
      const existingPaymentWithSameId = await prisma.payment.findFirst({
        where: {
          cashfreePaymentId: paymentId,
          id: { not: payment.id },
        },
      });

      if (existingPaymentWithSameId) {
        console.error(
          `Payment ID ${paymentId} already exists for a different payment record`
        );
        return;
      }
    }

    // Update payment record
    try {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          cashfreePaymentId: paymentId,
          status: "SUCCESS",
        },
      });
    } catch (updateError: any) {
      // Handle unique constraint error gracefully (race condition with callback)
      if (updateError.code === "P2002") {
        console.log(
          `Payment ${paymentId} already updated (race condition handled)`
        );
        // Check if payment was already successful
        const updatedPayment = await prisma.payment.findUnique({
          where: { id: payment.id },
        });
        if (updatedPayment?.status !== "SUCCESS") {
          // Update status only
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: "SUCCESS" },
          });
        }
      } else {
        throw updateError;
      }
    }

    // Add credits to user
    const result = await creditsService.addCredits(
      payment.userId,
      payment.credits,
      "CREDIT_PURCHASE",
      `Purchased ${payment.credits} credits`,
      {
        paymentId,
        orderId,
        amount: payment.amount / 100,
      }
    );

    if (result.success) {
    }
  } catch (error) {
    console.error("Error handling payment success webhook:", error);
  }
}

/**
 * Handle failed payment webhook
 */
async function handlePaymentFailed(data: any) {
  try {
    const orderId = data.order?.order_id;

    if (!orderId) {
      console.error("No order ID in webhook data");
      return;
    }
    await paymentService.handleFailedPayment(orderId);
  } catch (error) {
    console.error("Error handling payment failed webhook:", error);
  }
}

/**
 * Handle payment dropped webhook (user closed payment page)
 */
async function handlePaymentDropped(data: any) {
  try {
    const orderId = data.order?.order_id;

    if (!orderId) {
      console.error("No order ID in webhook data");
      return;
    }
    // Update payment status to failed
    await prisma.payment.updateMany({
      where: {
        cashfreeOrderId: orderId,
        status: "PENDING",
      },
      data: {
        status: "FAILED",
      },
    });
  } catch (error) {
    console.error("Error handling payment dropped webhook:", error);
  }
}
