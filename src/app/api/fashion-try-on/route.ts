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
  let tryOnRecord = null;

  try {
    console.log("Fashion try-on API called");
    console.log("Request body:", body);
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
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Both person image and clothing image URLs are required" },
        { status: 400 }
      );
    }

    // Return fake response in development mode
    if (devResponseHelpers.isDevelopment) {
      console.log("Using development mode - returning fake response");

      try {
        const fakeResponse =
          await devResponseHelpers.getFakeFashionTryOnResponse();
        console.log("Fake response generated successfully");
        return NextResponse.json({
          ...fakeResponse,
          resultImageUrl: fakeResponse.tryOnImageUrl, // Add the expected property
          tryOnId: "dev-mode-id",
        });
      } catch (devError) {
        console.error("Error generating fake response:", devError);
        // Return a simple fallback response
        return NextResponse.json({
          success: true,
          tryOnImageBase64:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
          tryOnImageUrl: "/images/model1.png",
          resultImageUrl: "/images/model1.png", // Add the expected property
          message:
            "Fashion try-on completed successfully [DEV MODE - FALLBACK]",
          textResponse: "Development mode active",
          tryOnId: "dev-mode-id",
        });
      }
    }

    // Import database services only for production mode
    const { tryOnService, userService, usageService, galleryService } =
      await import("@/lib/db-services");

    // Create try-on record in database
    try {
      tryOnRecord = await tryOnService.createTryOn({
        userId,
        projectId,
        modelImageId,
        customModelImageUrl: !modelImageId ? personImageUrl : undefined,
        garmentImageUrl: clothingImageUrl,
        backgroundImageUrl,
        numberOfImages,
        settings,
      });
      console.log("Created try-on record:", tryOnRecord.id);
    } catch (dbError) {
      console.error("Database error creating try-on record:", dbError);
      // Continue without database record if creation fails
      console.log("Continuing without database record due to error");
    }

    // Validate environment variable
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not found in environment variables");
      return NextResponse.json(
        { error: "AI service configuration error" },
        { status: 500 }
      );
    }

    console.log("Processing images with Gemini AI...");
    console.log("Person image URL:", personImageUrl);
    console.log("Clothing image URL:", clothingImageUrl);

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

    console.log("Images converted to base64, calling Gemini API...");

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

    console.log("Gemini API response received");

    // Extract the generated image
    let resultImageBase64 = null;
    let resultImageMimeType = "image/png"; // Default
    let responseText = "";

    if (
      response.candidates &&
      response.candidates[0] &&
      response.candidates[0].content &&
      response.candidates[0].content.parts
    ) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          responseText = part.text;
          console.log("Response text:", part.text);
        } else if (part.inlineData) {
          resultImageBase64 = part.inlineData.data;
          resultImageMimeType = part.inlineData.mimeType || "image/png";
          console.log(
            "Generated image received with MIME type:",
            resultImageMimeType
          );
          if (resultImageBase64) {
            console.log("Base64 length:", resultImageBase64.length);
          }
        }
      }
    } else {
      console.error("Invalid response structure from Gemini API");
      throw new Error("Invalid response from AI service");
    }

    if (!resultImageBase64) {
      // If no image was generated, analyze the response and provide helpful feedback
      console.log("No image generated, analyzing response...");

      let errorMessage =
        "The AI could not generate an image. Please ensure you're uploading a clear photo of a person and a clothing item.";

      if (responseText) {
        // Check for common issues based on AI response
        if (
          responseText.toLowerCase().includes("crow") ||
          responseText.toLowerCase().includes("animal")
        ) {
          errorMessage =
            "Please upload a photo of a person, not an animal or object. The AI detected that one of your images contains an animal.";
        } else if (responseText.toLowerCase().includes("not a person")) {
          errorMessage =
            "Please upload a clear photo of a person for the try-on feature to work properly.";
        } else if (
          responseText.toLowerCase().includes("unclear") ||
          responseText.toLowerCase().includes("quality")
        ) {
          errorMessage =
            "Please upload higher quality, clearer images for better results.";
        } else if (
          responseText.toLowerCase().includes("clothing") ||
          responseText.toLowerCase().includes("apparel")
        ) {
          errorMessage =
            "Please ensure the second image contains a clear view of a clothing item.";
        } else {
          // Use the AI's response directly if it's informative
          errorMessage = responseText;
        }
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          aiResponse: responseText,
        },
        { status: 400 }
      );
    }

    // Convert base64 to data URL for frontend consumption
    let resultImageDataUrl;

    try {
      // First validate the base64 data
      const buffer = Buffer.from(resultImageBase64, "base64");
      console.log("Base64 buffer size:", buffer.length);

      // Create data URL with correct MIME type
      resultImageDataUrl = `data:${resultImageMimeType};base64,${resultImageBase64}`;
      console.log(
        "Generated image data URL length:",
        resultImageDataUrl.length
      );
      console.log(
        "Data URL starts with:",
        resultImageDataUrl.substring(0, 100)
      );

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

    // Update try-on record with successful result
    const processingTime = Math.round((Date.now() - startTime) / 1000);

    if (tryOnRecord) {
      try {
        await tryOnService.updateTryOnResult(tryOnRecord.id, {
          resultImageUrl: resultImageDataUrl,
          status: "COMPLETED",
          processingTime,
        });
      } catch (dbError) {
        console.error("Error updating try-on record:", dbError);
        // Continue even if update fails
      }

      // Log usage for analytics
      try {
        await usageService.logUsage({
          userId,
          action: "fashion_try_on",
          credits: 1, // Deduct 1 credit per try-on
          metadata: {
            tryOnId: tryOnRecord.id,
            processingTime,
            numberOfImages,
          },
        });
      } catch (dbError) {
        console.error("Error logging usage:", dbError);
        // Continue even if usage logging fails
      }

      // Create gallery item if successful
      try {
        await galleryService.createGalleryItem({
          title: `Fashion Try-On ${new Date().toLocaleDateString()}`,
          description: "AI-generated fashion try-on result",
          imageUrl: resultImageDataUrl,
          type: "TRY_ON_RESULT",
          category: "Fashion Try-On",
          tags: ["try-on", "ai-generated"],
          userId,
          projectId,
          tryOnId: tryOnRecord.id,
          isPublic: false, // Default to private
          metadata: {
            processingTime,
            originalImages: {
              person: personImageUrl,
              clothing: clothingImageUrl,
              background: backgroundImageUrl,
            },
          },
        });
      } catch (dbError) {
        console.error("Error creating gallery item:", dbError);
        // Continue even if gallery creation fails
      }
    }

    console.log("Returning successful result");
    return NextResponse.json(result);
  } catch (error) {
    console.error("Fashion try-on API error:", error);

    // Update try-on record with error status
    if (tryOnRecord) {
      try {
        // Import database services for error handling
        const { tryOnService } = await import("@/lib/db-services");
        await tryOnService.updateTryOnResult(tryOnRecord.id, {
          resultImageUrl: "",
          status: "FAILED",
          processingTime: Math.round((Date.now() - startTime) / 1000),
        });
      } catch (dbError) {
        console.error(
          "Error updating try-on record with failure status:",
          dbError
        );
        // Continue even if update fails
      }
    }

    return NextResponse.json(
      {
        error: "Failed to process fashion try-on request",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        isDevelopment: devResponseHelpers.isDevelopment,
        nodeEnv: process.env.NODE_ENV,
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
