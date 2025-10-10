import { useState, useEffect } from "react";

export interface ImageData {
  url: string;
  alt?: string;
  photographer?: string;
  photographer_url?: string;
  id?: number;
  width?: number;
  height?: number;
  isFallback: boolean;
}

export interface ImageResponse {
  images: ImageData[];
  total: number;
  source: "pexels" | "fallback";
  error?: string;
}

export interface UseImagesOptions {
  category?: "background" | "fashion" | "product" | "photography" | "curated";
  count?: number;
  quality?: "small" | "medium" | "large";
  orientation?: "landscape" | "portrait" | "square" | "any";
  autoFetch?: boolean;
}

export function useImages(options: UseImagesOptions = {}) {
  const {
    category = "curated",
    count = 1,
    quality = "large",
    orientation = "any",
    autoFetch = true,
  } = options;

  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(autoFetch); // Start loading if autoFetch is true
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        category,
        count: count.toString(),
        quality,
        orientation,
      });

      const response = await fetch(`/api/images?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ImageResponse = await response.json();

      // Preload images to prevent flashing
      if (data.images.length > 0) {
        const preloadPromises = data.images.map((img) => {
          return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(img);
            image.onerror = () =>
              reject(new Error(`Failed to load image: ${img.url}`));
            image.src = img.url;
          });
        });

        // Wait for at least the first image to load
        try {
          await Promise.race(preloadPromises);
        } catch (preloadError) {
          console.warn("Image preload failed:", preloadError);
        }
      }

      setImages(data.images);

      if (data.error) {
        setError(data.error);
      }

      console.log(
        `Fetched ${data.images.length} images from ${data.source}:`,
        data.images
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch images";
      setError(errorMessage);
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchImages();
  };

  const getRandomImage = (): ImageData | null => {
    if (images.length === 0) return null;
    return images[Math.floor(Math.random() * images.length)];
  };

  useEffect(() => {
    if (autoFetch) {
      fetchImages();
    }
  }, [category, count, quality, orientation, autoFetch]);

  return {
    images,
    loading,
    error,
    fetchImages,
    refetch,
    getRandomImage,
    // Helper methods
    firstImage: images[0] || null,
    isEmpty: images.length === 0,
    hasError: !!error,
    isFromPexels: images.some((img) => !img.isFallback),
  };
}

// Specialized hooks for common use cases
export function useBackgroundImage(
  options: Omit<UseImagesOptions, "category" | "count"> = {}
) {
  return useImages({ ...options, category: "background", count: 1 });
}

export function useFashionImages(
  count: number = 5,
  options: Omit<UseImagesOptions, "category" | "count"> = {}
) {
  return useImages({ ...options, category: "fashion", count });
}

export function useProductImages(
  count: number = 5,
  options: Omit<UseImagesOptions, "category" | "count"> = {}
) {
  return useImages({ ...options, category: "product", count });
}

export function usePhotographyImages(
  count: number = 5,
  options: Omit<UseImagesOptions, "category" | "count"> = {}
) {
  return useImages({ ...options, category: "photography", count });
}
