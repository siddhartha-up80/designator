"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { imageService, ImagePair } from "@/lib/image-service";
import { Eye, Sparkles, Download, Share } from "lucide-react";

interface CSSMarqueeCarouselProps {
  duration?: number; // animation duration in seconds
  className?: string;
}

export function CSSMarqueeCarousel({
  duration = 30, // 30 seconds for one complete cycle
  className = "",
}: CSSMarqueeCarouselProps) {
  const [images, setImages] = useState<ImagePair[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImagePair | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Load images from image service
  useEffect(() => {
    const loadImages = async () => {
      try {
        console.log("Loading images for CSS marquee carousel...");
        const imagePairs = await imageService.getAvailableImagePairs();
        console.log("Loaded image pairs:", imagePairs);
        setImages(imagePairs);
      } catch (error) {
        console.error("Failed to load images:", error);
        // Fallback images if service fails
        const fallbackImages = Array.from({ length: 7 }, (_, i) => ({
          id: i + 1,
          modelImage: `model (${i + 1}).jpg`,
          productImage: `product (${i + 1}).png`,
          modelImagePath: `/images/model (${i + 1}).jpg`,
          productImagePath: `/images/product (${i + 1}).png`,
        }));
        setImages(fallbackImages);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  const handleImageClick = (image: ImagePair) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className={`py-8 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-rose-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`overflow-hidden ${className}`}>
        {/* CSS Animation Keyframes */}
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-33.333333%);
            }
          }

          .marquee-container {
            animation: marquee ${duration}s linear infinite;
            width: calc(300% + 48px);
          }

          .marquee-container.paused {
            animation-play-state: paused;
          }
        `}</style>

        <div
          className={`flex gap-6 marquee-container ${isPaused ? "paused" : ""}`}
        >
          {/* Triple the images for seamless infinite scroll */}
          {[...images, ...images, ...images].map((image, index) => (
            <div
              key={`${image.id}-${Math.floor(index / images.length)}-${index}`}
              className="flex-shrink-0 group cursor-pointer transition-transform duration-300"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onClick={() => handleImageClick(image)}
            >
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                {/* Model image */}
                <div className="w-64 h-80 overflow-hidden">
                  <img
                    src={image.modelImagePath}
                    alt={`AI Model wearing ${image.productImage}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    draggable={false}
                  />
                </div>

                {/* Product image overlay */}
                <div className="absolute top-4 right-4 w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-lg bg-white">
                  <img
                    src={image.productImagePath}
                    alt={`Product ${image.productImage}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    draggable={false}
                  />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/90 text-black hover:bg-white transform scale-90 group-hover:scale-100 transition-transform duration-300"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>

                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent opacity-60"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {selectedImage && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Model Image */}
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={selectedImage.modelImagePath}
                    alt={`Model wearing ${selectedImage.productImage}`}
                    className="w-full h-96 md:h-[500px] object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge variant="secondary">AI Generated</Badge>
                    <Badge variant="outline">High Quality</Badge>
                    <Badge variant="outline">Professional</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Professional model presentation created using advanced AI
                    technology. No photoshoot required.
                  </p>
                </div>
              </div>

              {/* Product Image */}
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800">
                  <img
                    src={selectedImage.productImagePath}
                    alt={`Product ${selectedImage.productImage}`}
                    className="w-full h-96 md:h-[500px] object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge variant="outline">Original Input</Badge>
                    <Badge variant="outline">Product #{selectedImage.id}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The original product image used as input for AI model
                    generation. See the transformation!
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
