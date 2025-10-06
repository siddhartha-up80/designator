import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");

    // Get recent credit transactions (only deductions, which represent activities)
    const recentTransactions = await prisma.creditTransaction.findMany({
      where: {
        userId: user.id,
        amount: { lt: 0 }, // Only deductions (activities)
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    // Get recent gallery images
    const recentImages = await prisma.galleryImage.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    // Combine and sort activities
    const activities = [
      ...recentTransactions.map((transaction) => ({
        id: transaction.id,
        type: "transaction",
        action: getActionFromTransactionType(transaction.type),
        description: transaction.description,
        createdAt: transaction.createdAt,
        icon: getIconFromTransactionType(transaction.type),
        credits: Math.abs(transaction.amount),
      })),
      ...recentImages.map((image) => ({
        id: image.id,
        type: "image",
        action: getActionFromImageType(image.type),
        description: `Generated ${image.title}`,
        createdAt: image.createdAt,
        icon: getIconFromImageType(image.type),
        imageUrl: image.imageUrl,
      })),
    ];

    // Sort by creation date and limit results
    activities.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const limitedActivities = activities.slice(0, limit);

    return NextResponse.json({ activities: limitedActivities });
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activities" },
      { status: 500 }
    );
  }
}

function getActionFromTransactionType(type: string): string {
  switch (type) {
    case "PHOTO_GENERATION":
      return "Generated Photo";
    case "TEXT_PROMPT":
      return "Generated from Prompt";
    case "PHOTO_ENHANCEMENT":
      return "Enhanced Photo";
    default:
      return "Activity";
  }
}

function getIconFromTransactionType(type: string): string {
  switch (type) {
    case "PHOTO_GENERATION":
      return "Camera";
    case "TEXT_PROMPT":
      return "Wand2";
    case "PHOTO_ENHANCEMENT":
      return "Sparkles";
    default:
      return "ActivityIcon";
  }
}

function getActionFromImageType(type: string): string {
  switch (type) {
    case "FASHION_TRYON":
      return "Fashion Try-On";
    case "PRODUCT_MODEL":
      return "Product Model";
    case "PROMPT_TO_IMAGE":
      return "Prompt to Image";
    case "AI_PHOTOGRAPHY":
      return "AI Photography";
    default:
      return "Generated Image";
  }
}

function getIconFromImageType(type: string): string {
  switch (type) {
    case "FASHION_TRYON":
      return "Shirt";
    case "PRODUCT_MODEL":
      return "Sparkles";
    case "PROMPT_TO_IMAGE":
      return "Wand2";
    case "AI_PHOTOGRAPHY":
      return "Camera";
    default:
      return "ImageIcon";
  }
}
