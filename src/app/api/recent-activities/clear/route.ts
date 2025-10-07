import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only delete activity-related transactions (deductions) and gallery images
    // Keep credit purchases and signup bonuses intact
    const deleteTransactions = prisma.creditTransaction.deleteMany({
      where: {
        userId: user.id,
        amount: { lt: 0 }, // Only delete deductions (activities, not purchases)
        type: {
          in: ["PHOTO_GENERATION", "TEXT_PROMPT", "PHOTO_ENHANCEMENT"],
        },
      },
    });

    const deleteGalleryImages = prisma.galleryImage.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Execute both deletions in a transaction
    const [deletedTransactions, deletedImages] = await prisma.$transaction([
      deleteTransactions,
      deleteGalleryImages,
    ]);

    return NextResponse.json({
      success: true,
      message: "Recent activities cleared successfully",
      deleted: {
        transactions: deletedTransactions.count,
        images: deletedImages.count,
      },
    });
  } catch (error) {
    console.error("Error clearing recent activities:", error);
    return NextResponse.json(
      { error: "Failed to clear recent activities" },
      { status: 500 }
    );
  }
}
