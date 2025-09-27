import { pexelsService } from "./pexels-service";

const isDevelopment = process.env.NODE_ENV === "development";

// Sample text responses for different contexts
const sampleTexts = {
  fashion:
    "This stylish fashion piece features contemporary design elements with premium fabric construction. The garment showcases modern silhouettes that blend comfort with sophisticated aesthetic appeal. Perfect for both casual and formal occasions, this piece embodies current fashion trends while maintaining timeless elegance. The color palette and texture work harmoniously to create a versatile addition to any wardrobe.",

  prompt:
    "A beautiful fashion model wearing elegant designer clothing, professional studio lighting, high-end fashion photography, dramatic shadows and highlights, luxury fashion editorial style, sophisticated pose, premium fabric textures, contemporary fashion styling, artistic composition, vibrant colors, fashion magazine quality, professional makeup and hair styling.",

  enhancement:
    "Enhanced image processing applied successfully. Improved color saturation, contrast optimization, noise reduction algorithms implemented, sharpness enhancement applied, professional grade filtering utilized. Image quality upgraded with advanced digital enhancement techniques including HDR processing, color grading, and detail refinement for premium visual output.",

  tryOn:
    "Virtual try-on processing completed successfully. Advanced AI fitting algorithms applied to seamlessly integrate clothing item with model. Realistic fabric simulation, proper sizing adjustments, and natural draping effects implemented. The result showcases how the garment would appear when worn, maintaining authentic proportions and realistic appearance for accurate fashion visualization.",

  photography:
    "Professional photography enhancement applied with studio-grade lighting corrections. Color temperature adjustments, exposure optimization, and professional retouching techniques implemented. Advanced post-processing effects including skin smoothing, background enhancement, and artistic filtering create magazine-quality results with commercial photography standards.",
};

// Get random model images from Pexels (fallback to local images)
const getRandomModelImages = async (count: number = 1): Promise<string[]> => {
  try {
    // Try to get images from Pexels
    const pexelsImages = await pexelsService.getFashionModelImages(count);

    if (pexelsImages && pexelsImages.length > 0) {
      return pexelsImages.map((img) => pexelsService.getBestQualityUrl(img));
    }
  } catch (error) {
    console.warn("Failed to fetch Pexels images, using local fallback:", error);
  }

  // Fallback to local images
  const localImages = [
    "/images/model1.png",
    "/images/model1_2.png",
    "/images/model1_3.png",
    "/images/model2.png",
    "/images/model5.png",
    "/images/model6.png",
    "/images/model7.png",
  ];

  const selectedImages = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * localImages.length);
    selectedImages.push(localImages[randomIndex]);
  }

  return selectedImages;
};

// Get random product images from public/images
const getRandomProductImages = (count: number = 1): string[] => {
  const productImages = [
    "product1.png",
    "product2.png",
    "product3.png",
    "product5.png",
  ];

  const selectedImages = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * productImages.length);
    selectedImages.push(`/images/${productImages[randomIndex]}`);
  }

  return selectedImages;
};

// Get random photography images from Pexels (fallback to local images)
const getRandomPhotographyImages = async (
  count: number = 1
): Promise<string[]> => {
  try {
    // Try to get images from Pexels
    const pexelsImages = await pexelsService.getPhotographyImages(count);

    if (pexelsImages && pexelsImages.length > 0) {
      return pexelsImages.map((img) => pexelsService.getBestQualityUrl(img));
    }
  } catch (error) {
    console.warn(
      "Failed to fetch Pexels photography images, using local fallback:",
      error
    );
  }

  // Fallback to local images
  const localImages = [
    "/images/model1.png",
    "/images/model1_2.png",
    "/images/model1_3.png",
    "/images/model2.png",
    "/images/model5.png",
    "/images/model6.png",
    "/images/model7.png",
  ];

  const selectedImages = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * localImages.length);
    selectedImages.push(localImages[randomIndex]);
  }

  return selectedImages;
};

// Convert local image path to base64 data
const imageUrlToBase64 = async (imageUrl: string): Promise<string> => {
  try {
    // Check if it's a Pexels URL (external URL)
    if (imageUrl.startsWith("http")) {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Return just the base64 string - frontend will add the data URL prefix
      return buffer.toString("base64");
    }

    // In server environment, read file directly from filesystem
    if (typeof window === "undefined") {
      const fs = await import("fs");
      const path = await import("path");

      const fullPath = path.join(
        process.cwd(),
        "public",
        imageUrl.replace(/^\//, "")
      );
      const imageBuffer = fs.readFileSync(fullPath);

      // Return just the base64 string - frontend will add the data URL prefix
      return imageBuffer.toString("base64");
    } else {
      // In browser environment, fetch from the server
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Return just the base64 string - frontend will add the data URL prefix
      return buffer.toString("base64");
    }
  } catch (error) {
    console.error(
      "Error converting image to base64:",
      error,
      "for URL:",
      imageUrl
    );
    console.log("Falling back to placeholder image");

    // Return a small placeholder image base64 (1x1 transparent pixel)
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
  }
};

export const devResponseHelpers = {
  isDevelopment,

  // Get fake model generation response
  getFakeModelGenerationResponse: async (numberOfOutputs: number = 1) => {
    const modelImages = await getRandomModelImages(numberOfOutputs);
    const generatedImages = [];
    const textResponses = [];

    for (const imageUrl of modelImages) {
      const base64 = await imageUrlToBase64(imageUrl);
      generatedImages.push(base64);
      textResponses.push(sampleTexts.fashion);
    }

    return {
      success: true,
      generatedImages,
      generatedImage: generatedImages[0],
      textResponses,
      textResponse: textResponses[0],
      totalGenerated: generatedImages.length,
      message: `Successfully generated ${generatedImages.length} image(s) [DEV MODE]`,
    };
  },

  // Get fake fashion try-on response
  getFakeFashionTryOnResponse: async () => {
    const modelImages = await getRandomModelImages(1);
    const base64 = await imageUrlToBase64(modelImages[0]);

    return {
      success: true,
      tryOnImageBase64: `data:image/png;base64,${base64}`, // Complete data URL for fashion try-on
      tryOnImageUrl: modelImages[0],
      resultImageUrl: modelImages[0], // Add the property expected by frontend - use the URL path
      message: "Fashion try-on completed successfully [DEV MODE]",
      textResponse: sampleTexts.tryOn,
    };
  },

  // Get fake prompt-to-image response
  getFakePromptToImageResponse: async (numberOfImages: number = 1) => {
    const imagePaths = await getRandomModelImages(numberOfImages);
    const images = [];

    for (const imageUrl of imagePaths) {
      const base64 = await imageUrlToBase64(imageUrl);
      // Convert to data URL format that frontend expects
      const dataUrl = `data:image/png;base64,${base64}`;
      images.push(dataUrl);
    }

    return {
      success: true,
      images, // Frontend expects this property name
      generationMode: "text-to-image",
      style: "photorealistic",
      aspectRatio: "1:1",
      prompt: "Generated in development mode",
      negativePrompt: "",
      settings: {
        guidanceScale: 7.5,
        steps: 20,
        numberOfImages: images.length,
      },
      message: `Successfully generated ${images.length} image(s) [DEV MODE]`,
    };
  },

  // Get fake image-to-prompt response
  getFakeImageToPromptResponse: (numberOfPrompts: number = 3) => {
    const prompts = [
      sampleTexts.prompt,
      "Fashion model in contemporary designer wear, studio photography, professional lighting setup, elegant pose, luxury fashion styling, high-end editorial photography, sophisticated wardrobe styling, premium fashion accessories, artistic fashion composition.",
      "Professional fashion photography featuring modern clothing design, dramatic studio lighting, fashion editorial style, contemporary styling, designer fashion pieces, artistic fashion photography, premium quality fabrics, sophisticated fashion presentation.",
    ];

    return {
      success: true,
      prompts: prompts.slice(0, numberOfPrompts),
      primaryPrompt: prompts[0],
      totalGenerated: numberOfPrompts,
      message: `Successfully generated ${numberOfPrompts} prompt(s) [DEV MODE]`,
    };
  },

  // Get fake photography enhancement response
  getFakePhotographyEnhanceResponse: async () => {
    const images = await getRandomPhotographyImages(1);
    const base64 = await imageUrlToBase64(images[0]);

    return {
      success: true,
      enhancedImage: `data:image/png;base64,${base64}`, // Complete data URL format that frontend expects
      enhancedImageData: base64, // Keep for backward compatibility
      enhancedImageUrl: images[0],
      enhancementType: "overall",
      intensity: "medium",
      message: "Image enhanced successfully [DEV MODE]",
      textResponse: sampleTexts.enhancement,
    };
  },

  // Get fake photography presets response
  getFakePhotographyPresetsResponse: async () => {
    const images = await getRandomPhotographyImages(1);
    const base64 = await imageUrlToBase64(images[0]);

    return {
      success: true,
      styledImage: `data:image/png;base64,${base64}`, // Complete data URL format that frontend expects
      processedImageData: base64, // Keep for backward compatibility
      processedImageUrl: images[0],
      presetName: "DEV_PRESET",
      message: "Photography preset applied successfully [DEV MODE]",
      textResponse: sampleTexts.photography,
    };
  },

  // Get sample text
  getSampleText: (context: keyof typeof sampleTexts = "fashion") => {
    return sampleTexts[context] || sampleTexts.fashion;
  },
};
