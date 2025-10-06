import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
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

    // Create some sample data for testing
    const sampleTransaction = await prisma.creditTransaction.create({
      data: {
        userId: user.id,
        amount: -25,
        type: "PHOTO_GENERATION",
        description: "Product Model Generation Test",
      },
    });

    const sampleGalleryImage = await prisma.galleryImage.create({
      data: {
        userId: user.id,
        title: "Test Fashion Model",
        imageUrl: "/images/model (1).jpg",
        type: "PRODUCT_MODEL",
      },
    });

    return NextResponse.json({
      success: true,
      transaction: sampleTransaction,
      galleryImage: sampleGalleryImage,
      message: "Sample data created successfully",
    });
  } catch (error) {
    console.error("Error creating sample data:", error);
    return NextResponse.json(
      { error: "Failed to create sample data" },
      { status: 500 }
    );
  }
}
