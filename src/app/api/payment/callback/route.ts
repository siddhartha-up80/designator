import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/cashfree-payment-service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      // Redirect to buy-credits with error
      return NextResponse.redirect(
        new URL("/buy-credits?status=error", request.url)
      );
    }

    // Verify payment
    const result = await paymentService.verifyPayment(orderId);

    if (result.success) {
      // Redirect to buy-credits with success
      return NextResponse.redirect(
        new URL(
          `/buy-credits?status=success&credits=${result.credits}`,
          request.url
        )
      );
    } else {
      // Redirect to buy-credits with error
      return NextResponse.redirect(
        new URL("/buy-credits?status=error", request.url)
      );
    }
  } catch (error) {
    console.error("Error in payment callback:", error);
    return NextResponse.redirect(
      new URL("/buy-credits?status=error", request.url)
    );
  }
}
