import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing NODE_ENV:", process.env.NODE_ENV);

    const isDevelopment = process.env.NODE_ENV === "development";
    console.log("Is development:", isDevelopment);

    // Test the Pexels service
    const { pexelsService } = await import("@/lib/pexels-service");
    console.log("Testing Pexels service...");

    const pexelsImages = await pexelsService.getFashionModelImages(2);
    console.log("Pexels images fetched:", pexelsImages.length);

    // Test the dev response helpers
    const { devResponseHelpers } = await import("@/lib/dev-responses");
    console.log(
      "Dev helpers loaded, isDevelopment:",
      devResponseHelpers.isDevelopment
    );

    if (devResponseHelpers.isDevelopment) {
      const fakeResponse =
        await devResponseHelpers.getFakeFashionTryOnResponse();
      console.log("Fake response generated successfully");

      // Test model generation with Pexels
      const modelResponse =
        await devResponseHelpers.getFakeModelGenerationResponse(1);
      console.log("Model generation response generated");

      return NextResponse.json({
        test: "success",
        environment: process.env.NODE_ENV || "undefined",
        isDevelopment: devResponseHelpers.isDevelopment,
        pexelsImagesCount: pexelsImages.length,
        pexelsSample: pexelsImages.slice(0, 1).map((img) => ({
          id: img.id,
          photographer: img.photographer,
          dimensions: `${img.width}x${img.height}`,
          availableSizes: {
            original: img.src.original,
            large2x: img.src.large2x,
            large: img.src.large,
            medium: img.src.medium,
            small: img.src.small,
          },
          selectedUrl: pexelsService.getBestQualityUrl(img),
        })),
        fakeResponse: {
          success: fakeResponse.success,
          hasResultImageUrl: !!fakeResponse.resultImageUrl,
          message: fakeResponse.message,
        },
        modelResponse: {
          success: modelResponse.success,
          imageCount: modelResponse.generatedImages?.length || 0,
          message: modelResponse.message,
        },
      });
    } else {
      return NextResponse.json({
        test: "success",
        environment: process.env.NODE_ENV,
        isDevelopment: false,
        message: "Not in development mode",
      });
    }
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json(
      {
        test: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
