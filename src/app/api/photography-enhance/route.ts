import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { devResponseHelpers } from "@/lib/dev-responses";
import { withCredits } from "@/lib/credits-middleware";
import { CREDIT_COSTS } from "@/lib/credits-service";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  // Wrap with credits middleware
  return withCredits(
    request,
    CREDIT_COSTS.PHOTO_ENHANCEMENT,
    "PHOTO_ENHANCEMENT",
    "Photography Enhancement",
    async (userId: string) => {
      return await handlePhotographyEnhance(request, userId);
    }
  );
}

async function handlePhotographyEnhance(
  request: NextRequest,
  userId: string
): Promise<NextResponse> {
  try {
    const {
      imageUrl,
      imageData,
      enhancementType = "overall",
      intensity = "medium",
      customPrompt,
      mimeType = "image/jpeg",
    } = await request.json();

    if (!imageUrl && !imageData) {
      return NextResponse.json(
        { error: "Image URL or image data is required" },
        { status: 400 }
      );
    }

    // Return fake response in development mode
    if (devResponseHelpers.isDevelopment) {
      return NextResponse.json(
        await devResponseHelpers.getFakePhotographyEnhanceResponse()
      );
    }

    let base64ImageData = imageData;

    // If imageUrl is provided, fetch and convert to base64
    if (imageUrl && !imageData) {
      try {
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
        }

        const arrayBuffer = await imageResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        base64ImageData = buffer.toString("base64");
      } catch (error) {
        return NextResponse.json(
          {
            error: `Failed to fetch image from URL: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
          { status: 400 }
        );
      }
    }

    // Define enhancement prompts based on type
    let enhancementPrompt = "";

    switch (enhancementType) {
      case "lighting":
        enhancementPrompt = `Enhance the lighting in this photograph. Improve exposure, balance highlights and shadows, add natural-looking light where needed, and create better overall illumination. Maintain natural colors and skin tones. Make the lighting appear professional and well-balanced.`;
        break;
      case "color":
        enhancementPrompt = `Enhance the colors in this photograph. Improve color balance, saturation, and vibrancy while maintaining natural-looking results. Correct any color casts, enhance skin tones, and make colors more appealing and vibrant without over-processing.`;
        break;
      case "sharpness":
        enhancementPrompt = `Enhance the sharpness and clarity of this photograph. Reduce blur, increase detail definition, improve edge clarity, and make the image appear crisp and well-focused. Remove any noise while preserving important details.`;
        break;
      case "custom":
        if (!customPrompt || !customPrompt.trim()) {
          return NextResponse.json(
            { error: "Custom prompt is required for custom enhancement type" },
            { status: 400 }
          );
        }
        enhancementPrompt = `Apply the following custom enhancement to this photograph: ${customPrompt.trim()}. Make sure to maintain the overall quality and natural appearance of the image while applying the requested changes.`;
        break;
      case "overall":
      default:
        enhancementPrompt = `Apply comprehensive AI enhancement to this photograph. Improve lighting by balancing exposure and shadows, enhance colors for better vibrancy and natural appearance, increase sharpness and clarity, reduce noise, and create an overall more polished and professional-looking image. Maintain natural skin tones and realistic appearance while significantly improving the photo quality.`;
        break;
    }

    // Adjust intensity
    const intensityMap: Record<string, string> = {
      light: "Apply subtle and gentle enhancements. ",
      medium: "Apply moderate enhancements for noticeable improvement. ",
      strong: "Apply strong enhancements for dramatic improvement. ",
    };
    const intensityModifier =
      intensityMap[intensity] ||
      "Apply moderate enhancements for noticeable improvement. ";

    const fullPrompt =
      intensityModifier +
      enhancementPrompt +
      " Return only the enhanced image.";

    // Use Gemini for image enhancement
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: [
        {
          inlineData: {
            mimeType: mimeType.startsWith("image/") ? mimeType : "image/jpeg",
            data: base64ImageData,
          },
        },
        fullPrompt,
      ],
    });

    if (!response.candidates || response.candidates.length === 0) {
      return NextResponse.json(
        { error: "No enhanced image generated" },
        { status: 500 }
      );
    }

    // Extract the generated image data
    const candidate = response.candidates[0];
    if (
      !candidate.content ||
      !candidate.content.parts ||
      candidate.content.parts.length === 0
    ) {
      return NextResponse.json(
        { error: "No image content in response" },
        { status: 500 }
      );
    }

    // Find the image part
    const imagePart = candidate.content.parts.find(
      (part: any) => part.inlineData?.data
    );

    if (!imagePart || !imagePart.inlineData?.data) {
      return NextResponse.json(
        { error: "No image data found in response" },
        { status: 500 }
      );
    }

    // Return the enhanced image as base64
    return NextResponse.json({
      success: true,
      enhancedImage: `data:${
        imagePart.inlineData.mimeType || "image/jpeg"
      };base64,${imagePart.inlineData.data}`,
      enhancementType,
      intensity,
      ...(enhancementType === "custom" &&
        customPrompt && { customPrompt: customPrompt.trim() }),
    });
  } catch (error) {
    console.error("Photography enhancement error:", error);
    return NextResponse.json(
      {
        error: "Failed to enhance image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
