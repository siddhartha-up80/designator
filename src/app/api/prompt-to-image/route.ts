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

  // Calculate credits: 10 per image
  const requiredCredits = CREDIT_COSTS.TEXT_PROMPT * numberOfImages;

  // Wrap with credits middleware
  return withCredits(
    request,
    requiredCredits,
    "TEXT_PROMPT",
    `Prompt to Image Generation (${numberOfImages} image${
      numberOfImages > 1 ? "s" : ""
    })`,
    async (userId: string) => {
      return await handlePromptToImage(body, userId);
    }
  );
}

async function handlePromptToImage(
  body: any,
  userId: string
): Promise<NextResponse> {
  try {
    const {
      generationMode = "text-to-image",
      textPrompt,
      negativePrompt,
      referenceImageUrl,
      referenceImageData,
      referenceImages, // New: array of reference image URLs
      imageStyle = "photorealistic",
      aspectRatio = "1:1",
      numberOfImages = 1,
      guidanceScale = 7.5,
      steps = 20,
      mimeType = "image/jpeg",
    } = body;

    // Validate required fields based on generation mode
    if (
      generationMode === "text-to-image" &&
      !textPrompt?.trim() &&
      (!referenceImages || referenceImages.length === 0)
    ) {
      return NextResponse.json(
        {
          error:
            "Text prompt or reference images are required for text-to-image generation",
        },
        { status: 400 }
      );
    }

    if (
      generationMode === "image-to-image" &&
      !referenceImageUrl &&
      !referenceImageData
    ) {
      return NextResponse.json(
        { error: "Reference image is required for image-to-image generation" },
        { status: 400 }
      );
    }

    // Validate number of images
    if (numberOfImages < 1 || numberOfImages > 4) {
      return NextResponse.json(
        { error: "Number of images must be between 1 and 4" },
        { status: 400 }
      );
    }

    // Return fake response in development mode
    if (devResponseHelpers.isDevelopment) {
      return NextResponse.json(
        await devResponseHelpers.getFakePromptToImageResponse(numberOfImages)
      );
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

    // Prepare style-specific prompts
    const styleModifiers = {
      photorealistic:
        "photorealistic, high quality, detailed, professional photography, 8K resolution",
      artistic: "artistic, painted style, creative, expressive, fine art",
      anime: "anime style, Japanese animation, manga art, colorful, stylized",
      "digital-art":
        "digital art, modern, computer graphics, concept art, detailed",
      fantasy: "fantasy art, magical, mystical, ethereal, enchanted",
      minimalist: "minimalist, clean, simple, modern design, elegant",
    };

    const aspectRatioMap = {
      "1:1": "square",
      "16:9": "landscape widescreen",
      "9:16": "portrait vertical",
      "4:3": "classic landscape",
      "3:2": "standard photo",
    };

    let finalPrompt = "";
    let promptContent: any;

    if (generationMode === "text-to-image") {
      // Text-to-image generation with optional reference images
      const styleModifier =
        styleModifiers[imageStyle as keyof typeof styleModifiers] ||
        styleModifiers.photorealistic;
      const aspectModifier =
        aspectRatioMap[aspectRatio as keyof typeof aspectRatioMap] || "square";

      finalPrompt = `Create a ${aspectModifier} ${styleModifier} image`;

      if (textPrompt?.trim()) {
        finalPrompt += `: ${textPrompt}`;
      }

      if (negativePrompt?.trim()) {
        finalPrompt += `. Avoid: ${negativePrompt}`;
      }

      // Handle multiple reference images
      if (referenceImages && referenceImages.length > 0) {
        finalPrompt += `. Use these reference images for style and composition guidance`;

        // Convert prompt to array format to include images
        const promptArray: any[] = [finalPrompt];

        // Add each reference image to the prompt
        for (const imageUrl of referenceImages) {
          try {
            const base64Data = await imageUrlToBase64(imageUrl);
            const imageMimeType = getMimeType(imageUrl);

            promptArray.push({
              inlineData: {
                mimeType: imageMimeType,
                data: base64Data,
              },
            });
          } catch (error) {
            console.error(
              `Failed to process reference image ${imageUrl}:`,
              error
            );
            // Continue with other images even if one fails
          }
        }

        promptContent = promptArray;
      } else {
        // For text-only, pass the prompt directly as a string
        promptContent = finalPrompt;
      }
    } else {
      // Image-to-image generation
      let base64ImageData = referenceImageData;

      // If referenceImageUrl is provided, convert to base64
      if (referenceImageUrl && !referenceImageData) {
        base64ImageData = await imageUrlToBase64(referenceImageUrl);
      }

      // Get MIME type
      const imageMimeType = referenceImageUrl
        ? getMimeType(referenceImageUrl)
        : mimeType;

      const styleModifier =
        styleModifiers[imageStyle as keyof typeof styleModifiers] ||
        styleModifiers.photorealistic;
      const aspectModifier =
        aspectRatioMap[aspectRatio as keyof typeof aspectRatioMap] || "square";

      let transformPrompt = `Transform this image into a ${aspectModifier} ${styleModifier} style`;

      if (textPrompt?.trim()) {
        transformPrompt += `: ${textPrompt}`;
      }

      if (negativePrompt?.trim()) {
        transformPrompt += `. Avoid: ${negativePrompt}`;
      }

      // For image-to-image, use array format with image and text
      promptContent = [
        transformPrompt,
        {
          inlineData: {
            mimeType: imageMimeType,
            data: base64ImageData,
          },
        },
      ];
    }
    // Generate multiple images if requested
    const generatedImages: string[] = [];

    for (let i = 0; i < numberOfImages; i++) {
      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: promptContent,
      });
      // Check if response is valid
      if (!response.candidates || response.candidates.length === 0) {
        console.warn(`No candidates in response for image ${i + 1}`);
        continue;
      }

      const candidate = response.candidates[0];
      if (
        !candidate.content ||
        !candidate.content.parts ||
        candidate.content.parts.length === 0
      ) {
        console.warn(`No content parts in response for image ${i + 1}`);
        continue;
      }

      // Find the image part
      const imagePart = candidate.content.parts.find(
        (part: any) => part.inlineData?.data
      );

      if (!imagePart || !imagePart.inlineData?.data) {
        console.warn(`No image data found in response for image ${i + 1}`);
        continue;
      }

      const resultImageBase64 = imagePart.inlineData.data;
      const resultImageMimeType = imagePart.inlineData.mimeType || "image/png";
      // Convert base64 to data URL for frontend display
      const dataUrl = `data:${resultImageMimeType};base64,${resultImageBase64}`;
      generatedImages.push(dataUrl);
    }

    if (generatedImages.length === 0) {
      throw new Error("No images were generated successfully");
    }
    return NextResponse.json({
      success: true,
      images: generatedImages,
      generationMode,
      style: imageStyle,
      aspectRatio,
      prompt: textPrompt || "Image transformation",
      negativePrompt: negativePrompt || "",
      settings: {
        guidanceScale,
        steps,
        numberOfImages: generatedImages.length,
      },
    });
  } catch (error) {
    console.error("Error in prompt-to-image API:", error);

    // Return appropriate error messages
    if (error instanceof Error) {
      if (error.message.includes("fetch")) {
        return NextResponse.json(
          {
            error:
              "Failed to fetch the reference image. Please check the image URL.",
          },
          { status: 400 }
        );
      } else if (error.message.includes("AI service")) {
        return NextResponse.json(
          {
            error:
              "AI service is currently unavailable. Please try again later.",
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        error:
          "Failed to generate images. Please try again with different settings.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
