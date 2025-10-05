import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { paymentService } from "@/lib/cashfree-payment-service";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Get user from database
    const { prisma } = await import("@/lib/prisma");
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get request body
    const { packageId } = await request.json();

    if (!packageId) {
      return NextResponse.json(
        { error: "Package ID is required" },
        { status: 400 }
      );
    }

    // Create Cashfree order
    const result = await paymentService.createOrder(
      user.id,
      packageId,
      user.email,
      user.name || undefined
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to create order" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sessionId: result.sessionId,
      orderId: result.orderId,
      amount: result.amount,
      currency: "INR",
    });
  } catch (error) {
    console.error("Error in create-order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
