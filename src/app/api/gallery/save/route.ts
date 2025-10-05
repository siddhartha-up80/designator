import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { title, imageUrl, type } = await request.json();

    if (!title || !imageUrl || !type) {
      return NextResponse.json(
        { error: "Title, imageUrl, and type are required" },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = [
      "FASHION_TRYON",
      "PRODUCT_MODEL",
      "PROMPT_TO_IMAGE",
      "AI_PHOTOGRAPHY",
    ];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid image type" },
        { status: 400 }
      );
    }

    const galleryImage = await prisma.galleryImage.create({
      data: {
        userId: user.id,
        title,
        imageUrl,
        type,
      },
    });

    return NextResponse.json({
      success: true,
      image: galleryImage,
      message: "Image saved to gallery successfully",
    });
  } catch (error) {
    console.error("Error saving image to gallery:", error);
    return NextResponse.json(
      {
        error: `Failed to save image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
