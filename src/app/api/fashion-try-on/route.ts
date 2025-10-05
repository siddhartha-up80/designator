import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { devResponseHelpers } from "@/lib/dev-responses";
import { withCredits } from "@/lib/credits-middleware";
import { CREDIT_COSTS } from "@/lib/credits-service";

// Helper function to convert image URL to base64
async function imageUrlToBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString("base64");
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
}

// Helper function to determine MIME type from image URL
function getMimeType(imageUrl: string): string {
  const extension = imageUrl.toLowerCase().split(".").pop() || "";
  const mimeTypes: { [key: string]: string } = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  };
  return mimeTypes[extension] || "image/jpeg";
}

export async function POST(request: NextRequest) {
  // Parse request to get numberOfImages for credit calculation
  const body = await request.json();
  const numberOfImages = body.numberOfImages || 1;

  // Calculate credits: 25 per image
  const requiredCredits = CREDIT_COSTS.PHOTO_GENERATION * numberOfImages;

  // Wrap with credits middleware
  return withCredits(
    request,
    requiredCredits,
    "PHOTO_GENERATION",
    `Fashion Try-On Generation (${numberOfImages} image${
      numberOfImages > 1 ? "s" : ""
    })`,
    async (userId: string) => {
      return await handleFashionTryOn(body, userId);
    }
  );
}

async function handleFashionTryOn(
  body: any,
  userId: string
): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    const {
      personImageUrl,
      clothingImageUrl,
      backgroundImageUrl,
      numberOfImages = 1,
      modelImageId,
      projectId,
      settings,
    } = body;

    // Validate required fields
    if (!personImageUrl || !clothingImageUrl) {
      return NextResponse.json(
        { error: "Both person image and clothing image URLs are required" },
        { status: 400 }
      );
    }

    // Return fake response in development mode
    if (devResponseHelpers.isDevelopment) {
      try {
        const fakeResponse =
          await devResponseHelpers.getFakeFashionTryOnResponse();

        // Import gallery service for development mode
        try {
          const { galleryService } = await import("@/lib/db-services");
          await galleryService.createGalleryItem({
            userId,
            title: `Fashion Try-on ${new Date().toLocaleString()}`,
            imageUrl: fakeResponse.resultImageUrl,
            type: "FASHION_TRYON",
          });
        } catch (galleryError) {
          console.error("Error saving to gallery (dev mode):", galleryError);
        }

        return NextResponse.json(fakeResponse);
      } catch (error) {
        console.error("Error in development mode:", error);
        return NextResponse.json(
          { error: "Development mode error" },
          { status: 500 }
        );
      }
    }

    // Validate environment variable
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not found in environment variables");
      return NextResponse.json(
        { error: "AI service configuration error" },
        { status: 500 }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Convert images to base64
    const personImageBase64 = await imageUrlToBase64(personImageUrl);
    const clothingImageBase64 = await imageUrlToBase64(clothingImageUrl);

    // Get MIME types
    const personMimeType = getMimeType(personImageUrl);
    const clothingMimeType = getMimeType(clothingImageUrl);

    // Create the prompt for fashion try-on
    const prompt = [
      {
        inlineData: {
          mimeType: personMimeType,
          data: personImageBase64,
        },
      },
      {
        inlineData: {
          mimeType: clothingMimeType,
          data: clothingImageBase64,
        },
      },
      {
        text: `Create a professional e-commerce fashion photo. Take the clothing item from the second image and let the person from the first image wear it. Generate a realistic, full-body shot of the person wearing the clothing item. Ensure the clothing fits naturally and realistically on the person's body with proper shadows, lighting, and fabric draping. The lighting should be professional and even, suitable for fashion photography. Keep the background neutral and clean. The final image should look natural and realistic, as if this person is actually wearing this clothing item.`,
      },
    ];

    // Generate the fashion try-on image
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: prompt,
    });

    // Extract the generated image
    let resultImageBase64 = null;
    let responseText = null;

    if (
      response.candidates &&
      response.candidates[0] &&
      response.candidates[0].content &&
      response.candidates[0].content.parts
    ) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          resultImageBase64 = part.inlineData.data;
        }
        if (part.text) {
          responseText = part.text;
        }
      }
    } else {
      console.error("Invalid response structure from Gemini API");
      throw new Error("Invalid response from AI service");
    }

    if (!resultImageBase64) {
      let errorMessage =
        "The AI could not generate an image. Please ensure you're uploading a clear photo of a person and a clothing item.";

      if (responseText) {
        if (
          responseText.toLowerCase().includes("crow") ||
          responseText.toLowerCase().includes("animal")
        ) {
          errorMessage =
            "Please upload a photo of a person, not an animal or object. The AI detected that one of your images contains an animal.";
        } else if (responseText.toLowerCase().includes("inappropriate")) {
          errorMessage =
            "Please ensure your images are appropriate and follow our content guidelines.";
        }
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: responseText || "No additional details available",
        },
        { status: 400 }
      );
    }

    // Determine MIME type for the generated image
    const resultImageMimeType = "image/png";

    // Convert base64 to data URL for frontend consumption
    let resultImageDataUrl;

    try {
      // First validate the base64 data
      const buffer = Buffer.from(resultImageBase64, "base64");
      // Create data URL with correct MIME type
      resultImageDataUrl = `data:${resultImageMimeType};base64,${resultImageBase64}`;

      // Verify it's valid base64
      if (resultImageBase64.length % 4 !== 0) {
        console.warn(
          "Base64 string length is not a multiple of 4, this might cause issues"
        );
      }
    } catch (error) {
      console.error("Error processing base64 image:", error);
      throw new Error("Failed to process generated image");
    }

    const result = {
      success: true,
      resultImageUrl: resultImageDataUrl,
      alternativeImageUrl: `/api/serve-image?data=${encodeURIComponent(
        resultImageBase64
      )}`,
      processingTime: "Generated by Gemini AI",
      confidence: 0.95,
      responseText,
      metadata: {
        originalPersonImage: personImageUrl,
        originalClothingImage: clothingImageUrl,
        model: "gemini-2.5-flash-image-preview",
        timestamp: new Date().toISOString(),
      },
    };

    // Save to gallery if successful
    try {
      const { galleryService } = await import("@/lib/db-services");
      await galleryService.createGalleryItem({
        userId,
        title: `Fashion Try-on ${new Date().toLocaleString()}`,
        imageUrl: resultImageDataUrl,
        type: "FASHION_TRYON",
      });
    } catch (galleryError) {
      console.error("Error saving to gallery:", galleryError);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fashion try-on API error:", error);

    return NextResponse.json(
      {
        error: "Failed to process fashion try-on",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "fashion-try-on",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
}
