import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(request: Request) {
  try {
    const {
      imageUrl,
      imageData,
      referenceImageUrl,
      prompt,
      updateInstructions,
      numberOfOutputs = 1,
      isUpdate = false,
      mimeType = "image/png",
    } = await request.json();

    if ((!imageUrl && !imageData) || !prompt) {
      return Response.json(
        { error: "Image (URL or data) and prompt are required" },
        { status: 400 }
      );
    }

    let base64ImageData = imageData;
    let base64ReferenceImageData = null;

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

    // If this is an update operation and referenceImageUrl is provided
    if (isUpdate && referenceImageUrl) {
      try {
        // Handle base64 data URLs
        if (referenceImageUrl.startsWith("data:image/")) {
          base64ReferenceImageData = referenceImageUrl.split(",")[1];
        } else {
          // Handle regular URLs
          const refImageResponse = await fetch(referenceImageUrl);
          if (!refImageResponse.ok) {
            throw new Error(
              `Failed to fetch reference image: ${refImageResponse.statusText}`
            );
          }
          const refArrayBuffer = await refImageResponse.arrayBuffer();
          const refBuffer = Buffer.from(refArrayBuffer);
          base64ReferenceImageData = refBuffer.toString("base64");
        }
      } catch (error) {
        console.error("Error processing reference image:", error);
        // Continue without reference image if it fails
      }
    }

    // Prepare the prompt for image generation
    let imagePrompt;

    if (isUpdate && base64ReferenceImageData && updateInstructions) {
      // For updates: include both original product image and reference generated image
      imagePrompt = [
        {
          text: `You are updating an existing fashion model image. Original prompt: "${prompt}". 
          Update instructions: "${updateInstructions}". 
          Keep the same model and product from the reference image, only apply the requested changes. 
          Maintain consistency with the existing image while incorporating the updates.`,
        },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64ImageData, // Original product image
          },
        },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64ReferenceImageData, // Reference generated image to maintain consistency
          },
        },
      ];
    } else {
      // For initial generation
      imagePrompt = [
        {
          text: `Create a fashion model image based on this clothing item. ${prompt}. Generate a high-quality image with professional photography lighting and styling.`,
        },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64ImageData, // Original product image
          },
        },
      ];
    }

    // Generate multiple images based on numberOfOutputs
    const generatedImages = [];
    const textResponses = [];

    for (let i = 0; i < numberOfOutputs; i++) {
      try {
        // Generate content using Gemini's image generation model
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-image-preview",
          contents: imagePrompt,
        });

        let generatedImageData = null;
        let textResponse = null;

        // Process the response
        if (
          response.candidates &&
          response.candidates[0] &&
          response.candidates[0].content &&
          response.candidates[0].content.parts
        ) {
          for (const part of response.candidates[0].content.parts) {
            if (part.text) {
              textResponse = part.text;
            } else if (part.inlineData) {
              generatedImageData = part.inlineData.data;
            }
          }
        }

        if (generatedImageData) {
          generatedImages.push(generatedImageData);
          if (textResponse) {
            textResponses.push(textResponse);
          }
        } else {
          console.warn(`No image data generated for iteration ${i + 1}`);
        }
      } catch (error) {
        console.error(`Error generating image ${i + 1}:`, error);
        // Continue with other images even if one fails
      }
    }

    if (generatedImages.length === 0) {
      throw new Error(
        `Failed to generate any images out of ${numberOfOutputs} requested`
      );
    }

    return Response.json({
      success: true,
      generatedImages: generatedImages,
      generatedImage: generatedImages[0], // For backward compatibility
      textResponses: textResponses,
      textResponse: textResponses[0], // For backward compatibility
      totalGenerated: generatedImages.length,
      message: `Successfully generated ${generatedImages.length} image(s)`,
    });
  } catch (error) {
    console.error("Error generating images:", error);
    return Response.json(
      {
        error: `Failed to generate images: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
