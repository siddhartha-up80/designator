import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { creditsService, TransactionType } from "./credits-service";
import { prisma } from "./prisma";

/**
 * Middleware to check if user has enough credits before allowing the request
 * Automatically refunds credits if the operation fails
 */
export async function withCredits(
  request: NextRequest,
  requiredCredits: number,
  transactionType: TransactionType,
  description: string,
  handler: (userId: string) => Promise<NextResponse>
): Promise<NextResponse> {
  let userId: string | null = null;
  let creditsDeducted = false;

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
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, credits: true, plan: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    userId = user.id;

    // Check if user has enough credits
    const hasEnough = await creditsService.hasEnoughCredits(
      user.id,
      requiredCredits
    );

    if (!hasEnough) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          required: requiredCredits,
          available: user.credits,
          message: `You need ${requiredCredits} credits but only have ${user.credits}. Please upgrade your plan.`,
        },
        { status: 402 } // 402 Payment Required
      );
    }

    // Deduct credits
    const deductResult = await creditsService.deductCredits(
      user.id,
      requiredCredits,
      transactionType,
      description
    );

    if (!deductResult.success) {
      return NextResponse.json(
        {
          error: deductResult.error || "Failed to deduct credits",
          available: deductResult.remainingCredits,
        },
        { status: 500 }
      );
    }

    creditsDeducted = true;

    // Execute the actual handler
    const response = await handler(user.id);

    // Check if the operation was successful
    const isSuccess = response.status >= 200 && response.status < 300;

    if (!isSuccess) {
      // Operation failed - refund credits
      console.log(
        `Operation failed (status: ${response.status}), refunding ${requiredCredits} credits to user ${userId}`
      );

      await creditsService.addCredits(
        userId,
        requiredCredits,
        "REFUND",
        `Refund: ${description} (operation failed)`
      );

      // Get updated credits after refund
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      });

      // Update response header with refunded credits
      if (updatedUser) {
        response.headers.set(
          "X-Remaining-Credits",
          updatedUser.credits.toString()
        );
      }

      console.log(
        `Refunded ${requiredCredits} credits. New balance: ${updatedUser?.credits}`
      );
    } else {
      // Operation succeeded - add remaining credits to response headers
      response.headers.set(
        "X-Remaining-Credits",
        deductResult.remainingCredits.toString()
      );
    }

    return response;
  } catch (error) {
    console.error("Error in withCredits middleware:", error);

    // If credits were deducted but an error occurred, refund them
    if (creditsDeducted && userId) {
      try {
        console.log(
          `Exception occurred, refunding ${requiredCredits} credits to user ${userId}`
        );

        await creditsService.addCredits(
          userId,
          requiredCredits,
          "REFUND",
          `Refund: ${description} (exception occurred)`
        );

        console.log(`Refunded ${requiredCredits} credits due to exception`);
      } catch (refundError) {
        console.error("Failed to refund credits:", refundError);
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Helper to get user ID from session
 */
export async function getUserFromSession(): Promise<{
  userId: string;
  email: string;
} | null> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true },
    });

    if (!user) {
      return null;
    }

    return { userId: user.id, email: user.email };
  } catch (error) {
    console.error("Error getting user from session:", error);
    return null;
  }
}
