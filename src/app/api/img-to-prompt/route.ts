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
  // Parse request to get numberOfPrompts for credit calculation
  const body = await request.json();
  const numberOfPrompts = body.numberOfPrompts || 1;

  // Calculate credits: 10 per prompt (treating each prompt as a generation)
  const requiredCredits = CREDIT_COSTS.TEXT_PROMPT * numberOfPrompts;

  // Wrap with credits middleware
  return withCredits(
    request,
    requiredCredits,
    "TEXT_PROMPT",
    `Image to Prompt Generation (${numberOfPrompts} prompt${
      numberOfPrompts > 1 ? "s" : ""
    })`,
    async (userId: string) => {
      return await handleImgToPrompt(body, userId);
    }
  );
}

async function handleImgToPrompt(
  body: any,
  userId: string
): Promise<NextResponse> {
  try {
    const {
      imageUrl,
      imageData,
      promptStyle = "detailed",
      numberOfPrompts = 3,
      mimeType = "image/jpeg",
    } = body;

    // Validate required fields
    if (!imageUrl && !imageData) {
      return NextResponse.json(
        { error: "Image URL or image data is required" },
        { status: 400 }
      );
    }

    // Validate number of prompts
    if (numberOfPrompts < 1 || numberOfPrompts > 5) {
      return NextResponse.json(
        { error: "Number of prompts must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Return fake response in development mode
    // if (devResponseHelpers.isDevelopment) {
    //   return NextResponse.json(
    //     devResponseHelpers.getFakeImageToPromptResponse(numberOfPrompts)
    //   );
    // }

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

    let base64ImageData = imageData;

    // If imageUrl is provided, convert to base64
    if (imageUrl && !imageData) {
      base64ImageData = await imageUrlToBase64(imageUrl);
    }

    // Get MIME type
    const imageMimeType = imageUrl ? getMimeType(imageUrl) : mimeType;
    // Define prompt styles
    const stylePrompts = {
      detailed: `Analyze this image and create ${numberOfPrompts} detailed, comprehensive text prompts that describe the visual content. Focus on:
- Overall composition and scene description
- Subject details (people, objects, clothing, expressions)
- Lighting, colors, and visual atmosphere
- Background and environment
- Style, mood, and artistic elements
- Camera angle and perspective
Each prompt should be detailed enough to recreate a similar image using AI image generation tools.`,

      artistic: `Analyze this image and create ${numberOfPrompts} artistic text prompts that emphasize:
- Artistic style and technique
- Color palette and mood
- Composition and visual flow
- Artistic movement or genre (if applicable)
- Emotional tone and atmosphere
- Visual aesthetics and design elements
Each prompt should focus on the artistic and creative aspects of the image.`,

      commercial: `Analyze this image and create ${numberOfPrompts} commercial-ready text prompts suitable for marketing and business use:
- Product or subject presentation
- Professional lighting and composition
- Brand-appropriate styling
- Commercial photography techniques
- Marketing appeal and target audience
- Clean, professional aesthetic
Each prompt should be suitable for creating commercial or marketing imagery.`,

      technical: `Analyze this image and create ${numberOfPrompts} technical text prompts that include:
- Camera settings and photography details
- Lighting setup and techniques
- Technical composition elements
- Equipment specifications (if identifiable)
- Photography style and method
- Technical quality aspects
Each prompt should include specific technical details for precise image recreation.`,
    };

    const selectedPrompt =
      stylePrompts[promptStyle as keyof typeof stylePrompts] ||
      stylePrompts.detailed;

    // Create the prompt for image analysis
    const prompt = [
      {
        inlineData: {
          mimeType: imageMimeType,
          data: base64ImageData,
        },
      },
      {
        text:
          selectedPrompt +
          "\n\nProvide each prompt as a separate, complete description. Number each prompt (1, 2, 3, etc.) and make sure each one is detailed and standalone.",
      },
    ];

    // Generate the prompts
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-thinking-exp",
      contents: prompt,
    });
    // Extract the generated text
    let responseText = "";
    let keyElements = "";

    if (
      response.candidates &&
      response.candidates[0] &&
      response.candidates[0].content &&
      response.candidates[0].content.parts
    ) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          responseText = part.text;
        }
      }
    } else {
      console.error("Invalid response structure from Gemini API");
      throw new Error("Invalid response from AI service");
    }

    if (!responseText) {
      throw new Error("No text response received from AI service");
    }

    // Parse the response to extract individual prompts
    const prompts: string[] = [];

    if (!responseText.trim()) {
      throw new Error("Empty response from AI service");
    }

    // Try multiple parsing strategies
    let parsedPrompts: string[] = [];

    // Strategy 1: Parse numbered items
    const numberedMatches = responseText.match(
      /\d+[\.\)\:][\s]*([^]*?)(?=\d+[\.\)\:]|$)/g
    );
    if (numberedMatches && numberedMatches.length >= numberOfPrompts) {
      parsedPrompts = numberedMatches
        .map((match) => match.replace(/^\d+[\.\)\:][\s]*/, "").trim())
        .filter((p) => p.length > 30);
    }

    // Strategy 2: Split by double newlines
    if (parsedPrompts.length < numberOfPrompts) {
      const paragraphs = responseText
        .split(/\n\n+/)
        .filter((p) => p.trim().length > 30);
      if (paragraphs.length >= numberOfPrompts) {
        parsedPrompts = paragraphs.map((p) =>
          p.replace(/^\d+[\.\)\:]?\s*/, "").trim()
        );
      }
    }

    // Strategy 3: Split by single newlines and group
    if (parsedPrompts.length < numberOfPrompts) {
      const lines = responseText
        .split("\n")
        .filter((line) => line.trim().length > 30);
      if (lines.length >= numberOfPrompts) {
        parsedPrompts = lines
          .slice(0, numberOfPrompts)
          .map((line) => line.replace(/^\d+[\.\)\:]?\s*/, "").trim());
      }
    }

    // Strategy 4: Fallback - split the text into equal parts
    if (parsedPrompts.length < numberOfPrompts) {
      const cleanText = responseText.replace(/^\d+[\.\)\:]?\s*/gm, "").trim();
      const avgLength = Math.floor(cleanText.length / numberOfPrompts);
      for (let i = 0; i < numberOfPrompts; i++) {
        const start = i * avgLength;
        const end =
          i === numberOfPrompts - 1 ? cleanText.length : (i + 1) * avgLength;
        const segment = cleanText.substring(start, end).trim();
        if (segment.length > 30) {
          parsedPrompts.push(segment);
        }
      }
    }

    // Clean and validate prompts
    const finalPrompts = parsedPrompts
      .slice(0, numberOfPrompts)
      .map((prompt) => prompt.replace(/\s+/g, " ").trim())
      .filter((prompt) => prompt.length > 30);

    // Ensure we have at least one prompt
    if (finalPrompts.length === 0) {
      const fallbackPrompt = responseText
        .substring(0, Math.min(500, responseText.length))
        .trim();
      if (fallbackPrompt.length > 30) {
        finalPrompts.push(fallbackPrompt);
      } else {
        throw new Error("Generated response too short or invalid");
      }
    }

    // Generate key elements by analyzing the first part of the response
    const elementLines = responseText.split("\n").slice(0, 5);
    keyElements = elementLines
      .map((line) => line.replace(/^\d+[\.\)\:]?\s*/, "").trim())
      .filter((line) => line.length > 10)
      .slice(0, 2)
      .join(", ")
      .replace(/[,\s]+$/, "");

    // Ensure we have at least one prompt
    if (finalPrompts.length === 0) {
      finalPrompts.push(
        responseText.substring(0, Math.min(500, responseText.length))
      );
    }

    // Use the final prompts
    const cleanedPrompts = finalPrompts;
    return NextResponse.json({
      success: true,
      prompts: cleanedPrompts,
      keyElements: keyElements || "Image analysis complete",
      promptStyle,
      numberOfPrompts: cleanedPrompts.length,
    });
  } catch (error) {
    console.error("Error in image-to-prompt API:", error);

    // Return appropriate error messages
    if (error instanceof Error) {
      if (error.message.includes("fetch")) {
        return NextResponse.json(
          { error: "Failed to fetch the image. Please check the image URL." },
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
          "Failed to generate prompts. Please try again with a different image.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
