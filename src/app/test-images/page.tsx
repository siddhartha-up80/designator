"use client";

import { useEffect, useState } from "react";
import { imageService, ImagePair } from "@/lib/image-service";

export default function ImageTestPage() {
  const [imagePairs, setImagePairs] = useState<ImagePair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        console.log("Testing image service...");
        const pairs = await imageService.getAvailableImagePairs();
        console.log("Got image pairs:", pairs);
        setImagePairs(pairs);

        const carouselImages = await imageService.getModelImagesForCarousel();
        console.log("Got carousel images:", carouselImages);
      } catch (err) {
        console.error("Error loading images:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Service Test</h1>
      <p>Found {imagePairs.length} image pairs:</p>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {imagePairs.map((pair) => (
          <div key={pair.id} className="border p-4 rounded">
            <h3>Pair {pair.id}</h3>
            <div className="mt-2">
              <img
                src={pair.modelImagePath}
                alt={`Model ${pair.id}`}
                className="w-full h-32 object-cover rounded mb-2"
                onError={(e) =>
                  console.error(
                    `Failed to load model image: ${pair.modelImagePath}`,
                    e
                  )
                }
              />
              <p>Model: {pair.modelImage}</p>
            </div>
            <div className="mt-2">
              <img
                src={pair.productImagePath}
                alt={`Product ${pair.id}`}
                className="w-full h-32 object-cover rounded mb-2"
                onError={(e) =>
                  console.error(
                    `Failed to load product image: ${pair.productImagePath}`,
                    e
                  )
                }
              />
              <p>Product: {pair.productImage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
