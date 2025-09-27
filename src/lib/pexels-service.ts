// Pexels API service for fetching high-quality images in development mode
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "";
const PEXELS_BASE_URL = "https://api.pexels.com/v1";

interface PexelsImage {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsResponse {
  page: number;
  per_page: number;
  photos: PexelsImage[];
  total_results: number;
  next_page?: string;
}

class PexelsService {
  private async fetchFromPexels(endpoint: string): Promise<PexelsResponse> {
    const response = await fetch(`${PEXELS_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Search for images with specific query
  async searchImages(
    query: string,
    perPage: number = 10,
    page: number = 1
  ): Promise<PexelsImage[]> {
    try {
      const data = await this.fetchFromPexels(
        `/search?query=${encodeURIComponent(
          query
        )}&per_page=${perPage}&page=${page}`
      );
      return data.photos;
    } catch (error) {
      console.warn("Failed to fetch from Pexels, using fallback:", error);
      return [];
    }
  }

  // Get curated high-quality photos
  async getCuratedImages(
    perPage: number = 10,
    page: number = 1
  ): Promise<PexelsImage[]> {
    try {
      const data = await this.fetchFromPexels(
        `/curated?per_page=${perPage}&page=${page}`
      );
      return data.photos;
    } catch (error) {
      console.warn(
        "Failed to fetch curated images from Pexels, using fallback:",
        error
      );
      return [];
    }
  }

  // Get fashion model images
  async getFashionModelImages(count: number = 5): Promise<PexelsImage[]> {
    const queries = [
      "high fashion model portrait professional",
      "professional fashion model studio",
      "fashion photography editorial model",
      "professional portrait model beauty",
      "fashion shoot professional model",
      "elegant fashion model portrait",
    ];

    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    const randomPage = Math.floor(Math.random() * 5) + 1; // Random page 1-5

    // Request more images to have better selection
    const images = await this.searchImages(
      randomQuery,
      Math.max(count * 2, 15),
      randomPage
    );
    return images.slice(0, count);
  }

  // Get product photography images
  async getProductImages(count: number = 5): Promise<PexelsImage[]> {
    const queries = [
      "professional product photography studio",
      "fashion accessories professional photography",
      "high quality clothing photography",
      "fashion items professional shoot",
      "lifestyle products professional photography",
      "commercial product photography",
    ];

    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    const randomPage = Math.floor(Math.random() * 3) + 1; // Random page 1-3

    // Request more images to have better selection
    const images = await this.searchImages(
      randomQuery,
      Math.max(count * 2, 12),
      randomPage
    );
    return images.slice(0, count);
  }

  // Get photography/portrait images
  async getPhotographyImages(count: number = 5): Promise<PexelsImage[]> {
    const queries = [
      "professional portrait photography high quality",
      "professional headshots studio lighting",
      "studio photography professional portrait",
      "natural lighting portrait professional",
      "photography model professional shoot",
      "high quality portrait photography",
    ];

    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    const randomPage = Math.floor(Math.random() * 4) + 1; // Random page 1-4

    // Request more images to have better selection
    const images = await this.searchImages(
      randomQuery,
      Math.max(count * 2, 12),
      randomPage
    );
    return images.slice(0, count);
  }

  // Convert Pexels image to base64 data URL
  async imageUrlToBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");

      // Determine MIME type from URL or default to JPEG
      const mimeType = imageUrl.includes(".png") ? "image/png" : "image/jpeg";

      return `data:${mimeType};base64,${base64}`;
    } catch (error) {
      console.error("Error converting Pexels image to base64:", error);
      // Return a fallback 1x1 pixel image
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    }
  }

  // Get the best quality URL for an image
  getBestQualityUrl(image: PexelsImage): string {
    // Use large2x for highest quality, then large, then original
    return (
      image.src.large2x ||
      image.src.large ||
      image.src.original ||
      image.src.medium
    );
  }
}

export const pexelsService = new PexelsService();
