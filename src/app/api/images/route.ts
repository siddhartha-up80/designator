import { pexelsService } from "@/lib/pexels-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Get parameters from query string
  const category = searchParams.get("category") || "curated";
  const count = parseInt(searchParams.get("count") || "1");
  const quality = searchParams.get("quality") || "large"; // large, medium, small
  const orientation = searchParams.get("orientation") || "any"; // landscape, portrait, square, any

  try {
    let images: any[] = [];

    // Define fallback images for all categories
    const fallbackImages = ["/background1.png", "/background2.png"];

    // Fetch images based on category
    switch (category.toLowerCase()) {
      case "background":
        // For backgrounds, get curated high-quality images
        images = await pexelsService.getCuratedImages(
          Math.max(count * 2, 10),
          Math.floor(Math.random() * 5) + 1
        );
        break;

      case "fashion":
        // For fashion, use the fashion model service
        images = await pexelsService.getFashionModelImages(
          Math.max(count * 2, 8)
        );
        break;

      case "product":
        // For products, use the product service
        images = await pexelsService.getProductImages(Math.max(count * 2, 8));
        break;

      case "photography":
        // For photography, use the photography service
        images = await pexelsService.getPhotographyImages(
          Math.max(count * 2, 8)
        );
        break;

      case "curated":
      default:
        // Default to curated images
        images = await pexelsService.getCuratedImages(
          Math.max(count * 2, 8),
          Math.floor(Math.random() * 3) + 1
        );
        break;
    }

    // Filter images by orientation if specified
    if (orientation !== "any" && images.length > 0) {
      images = images.filter((img) => {
        const aspectRatio = img.width / img.height;
        switch (orientation) {
          case "landscape":
            return aspectRatio > 1.2;
          case "portrait":
            return aspectRatio < 0.8;
          case "square":
            return aspectRatio >= 0.8 && aspectRatio <= 1.2;
          default:
            return true;
        }
      });
    }

    // If no images or insufficient images, use fallback
    if (!images || images.length === 0) {
      const selectedImages = [];

      for (let i = 0; i < count; i++) {
        const randomImage =
          fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
        selectedImages.push({ url: randomImage, isFallback: true });
      }

      return NextResponse.json({
        images: selectedImages,
        total: selectedImages.length,
        source: "fallback",
      });
    }

    // Shuffle and select the requested number of images
    const shuffledImages = images.sort(() => Math.random() - 0.5);
    const selectedImages = shuffledImages.slice(0, count).map((img) => {
      let url: string;

      // Select URL based on quality preference
      switch (quality) {
        case "small":
          url = img.src.small || img.src.medium || img.src.large;
          break;
        case "medium":
          url = img.src.medium || img.src.large || img.src.small;
          break;
        case "large":
        default:
          url = pexelsService.getBestQualityUrl(img);
          break;
      }

      return {
        url,
        alt: img.alt || "Image",
        photographer: img.photographer,
        photographer_url: img.photographer_url,
        id: img.id,
        width: img.width,
        height: img.height,
        isFallback: false,
      };
    });

    return NextResponse.json({
      images: selectedImages,
      total: selectedImages.length,
      source: "pexels",
    });
  } catch (error) {
    console.warn(`Failed to fetch ${category} images from Pexels:`, error);

    // Define fallback images for error case
    const fallbackImages = ["/background1.png", "/background2.png"];

    // Return fallback images
    const selectedImages = [];

    for (let i = 0; i < count; i++) {
      const randomImage =
        fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
      selectedImages.push({
        url: randomImage,
        alt: "Fallback image",
        isFallback: true,
      });
    }

    return NextResponse.json({
      images: selectedImages,
      total: selectedImages.length,
      source: "fallback",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
