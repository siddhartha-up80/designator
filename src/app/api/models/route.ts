import { NextRequest, NextResponse } from "next/server";
import { modelService } from "@/lib/db-services";
import { Gender } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get("gender") as Gender | null;
    const category = searchParams.get("category")?.split(",") || [];
    const tags = searchParams.get("tags")?.split(",") || [];
    const search = searchParams.get("search") || undefined;
    const type = searchParams.get("type") || "all"; // 'all' or 'favorites'

    if (type === "favorites") {
      // TODO: Get userId from authentication
      const userId = searchParams.get("userId") || "temp-user";
      const favoriteModels = await modelService.getFavoriteModels(userId);

      return NextResponse.json({
        success: true,
        models: favoriteModels,
        count: favoriteModels.length,
      });
    }

    const filters: any = {};
    if (gender) filters.gender = gender;
    if (category.length > 0) filters.category = category;
    if (tags.length > 0) filters.tags = tags;
    if (search) filters.search = search;

    const models = await modelService.getPublicModels(filters);

    return NextResponse.json({
      success: true,
      models,
      count: models.length,
    });
  } catch (error) {
    console.error("Get models API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch models",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, modelImageId, action } = body;

    if (action === "toggle_favorite") {
      const isFavorited = await modelService.toggleFavorite(
        userId,
        modelImageId
      );

      return NextResponse.json({
        success: true,
        isFavorited,
        message: isFavorited ? "Added to favorites" : "Removed from favorites",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Models API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
