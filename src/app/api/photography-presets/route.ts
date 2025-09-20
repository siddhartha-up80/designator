import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(request: Request) {
  try {
    const {
      imageUrl,
      imageData,
      presetName,
      mimeType = "image/jpeg",
    } = await request.json();

    if (!imageUrl && !imageData) {
      return Response.json(
        { error: "Image URL or image data is required" },
        { status: 400 }
      );
    }

    if (!presetName) {
      return Response.json(
        { error: "Preset name is required" },
        { status: 400 }
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
        return Response.json(
          {
            error: `Failed to fetch image from URL: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
          { status: 400 }
        );
      }
    }

    // Define style preset prompts
    const presetPrompts: Record<string, string> = {
      "Studio Portrait": `Transform this photograph into a professional studio portrait style. Apply clean, controlled lighting with soft shadows. Enhance skin tones to be smooth and natural. Create a polished, commercial photography look with crisp details, balanced exposure, and professional color grading. The result should look like it was shot in a professional photography studio with perfect lighting setup.`,

      "Natural Light": `Apply a natural, soft daylight photography style to this image. Create the effect of beautiful natural lighting with warm, soft tones. Enhance the image to look like it was photographed during golden hour or in perfect natural light conditions. Maintain organic, unprocessed appearance while improving clarity and warmth. Make colors appear natural and inviting.`,

      "High Fashion": `Transform this photograph into a high fashion editorial style. Apply bold contrast, dramatic lighting, and sophisticated color grading. Create sharp details with artistic shadows and highlights. The result should have the aesthetic of a premium fashion magazine shoot - striking, dramatic, and visually impactful with elevated contrast and professional color treatment.`,

      "Vintage Film": `Apply a vintage film photography aesthetic to this image. Add subtle film grain texture, warm color tones, and slightly faded contrast characteristic of analog film photography. Create nostalgic, timeless look with soft highlights and rich, warm shadows. The result should evoke classic film photography from the 70s-80s era.`,

      "Clean & Bright": `Transform this photograph into a clean, bright commercial style. Apply fresh, clean lighting with bright, airy tones. Enhance colors to be vibrant yet natural. Create a modern, commercial photography look that's perfect for advertising or lifestyle content. The result should be crisp, bright, and professionally polished with excellent clarity.`,

      "Moody & Dark": `Apply a moody, dramatic photography style with deep shadows and rich contrast. Create atmospheric, cinematic lighting with darker tones and artistic shadow play. Enhance the image to have a sophisticated, artistic mood with deeper colors and dramatic lighting effects. The result should evoke emotion and artistic depth.`,
    };

    const presetPrompt = presetPrompts[presetName];
    if (!presetPrompt) {
      return Response.json(
        { error: `Unknown preset: ${presetName}` },
        { status: 400 }
      );
    }

    const fullPrompt =
      presetPrompt +
      " Maintain the original composition and subject while applying the style transformation. Return only the styled image.";

    // Use Gemini for style application
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
      return Response.json(
        { error: "No styled image generated" },
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
      return Response.json(
        { error: "No image content in response" },
        { status: 500 }
      );
    }

    // Find the image part
    const imagePart = candidate.content.parts.find(
      (part: any) => part.inlineData?.data
    );

    if (!imagePart || !imagePart.inlineData?.data) {
      return Response.json(
        { error: "No image data found in response" },
        { status: 500 }
      );
    }

    // Return the styled image as base64
    return Response.json({
      success: true,
      styledImage: `data:${
        imagePart.inlineData.mimeType || "image/jpeg"
      };base64,${imagePart.inlineData.data}`,
      presetName,
    });
  } catch (error) {
    console.error("Photography preset error:", error);
    return Response.json(
      {
        error: "Failed to apply style preset",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
