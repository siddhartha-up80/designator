"use client";

import React, { useState, useRef, useEffect } from "react";
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

interface MarqueeImageCarouselProps {
  speed?: number; // pixels per second
  className?: string;
}

export function MarqueeImageCarousel({
  speed = 50, // 50 pixels per second for smooth scrolling
  className = "",
}: MarqueeImageCarouselProps) {
  const [images, setImages] = useState<ImagePair[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImagePair | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastTimestampRef = useRef<number>(0);
  const scrollPositionRef = useRef<number>(0);

  // Load images from image service
  useEffect(() => {
    const loadImages = async () => {
      try {
        console.log("Loading images for marquee carousel...");
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

  // Smooth infinite scroll animation
  useEffect(() => {
    if (images.length === 0) return;

    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }

      if (!isPaused) {
        const deltaTime = timestamp - lastTimestampRef.current;

        // Move scroll position by speed * time elapsed
        scrollPositionRef.current += (speed * deltaTime) / 1000;

        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const maxScroll = container.scrollWidth / 3; // Since we have 3 copies

          // Reset position when we've scrolled one full set
          if (scrollPositionRef.current >= maxScroll) {
            scrollPositionRef.current = 0;
          }

          container.scrollLeft = scrollPositionRef.current;
        }
      }

      lastTimestampRef.current = timestamp;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [images.length, speed]);

  const handleImageClick = (image: ImagePair) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  const handleImageHover = (isHovering: boolean) => {
    setIsPaused(isHovering);
    if (!isHovering) {
      // Reset timestamp when resuming to avoid jumps
      lastTimestampRef.current = 0;
    }
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
        <div
          ref={scrollContainerRef}
          className="flex gap-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overflow-x-hidden [will-change:scroll-position]"
        >
          {/* Triple the images for seamless infinite scroll */}
          {[...images, ...images, ...images].map((image, index) => (
            <div
              key={`${image.id}-${Math.floor(index / images.length)}-${index}`}
              className="flex-shrink-0 group cursor-pointer transition-transform duration-300"
              onMouseEnter={() => handleImageHover(true)}
              onMouseLeave={() => handleImageHover(false)}
              onClick={() => handleImageClick(image)}
            >
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Model image */}
                <div className="w-64 h-80 overflow-hidden">
                  <img
                    src={image.modelImagePath}
                    alt={`AI Model wearing ${image.productImage}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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

                {/* AI Badge */}
                <div className="absolute bottom-4 left-4">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-gray-800 text-xs shadow-sm"
                  >
                    AI Generated
                  </Badge>
                </div>
              </div>

              {/* Image info */}
              <div className="mt-3 px-2">
                <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  AI Model #{image.id}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Professional Model Presentation
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-rose-500" />
              AI-Generated Model Presentation
            </DialogTitle>
          </DialogHeader>

          {selectedImage && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Model Image */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-rose-600">
                    Model Presentation
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
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
                <h3 className="text-lg font-semibold text-blue-600">
                  Original Product
                </h3>
                <div className="relative overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800 p-8">
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

          <div className="flex justify-center pt-6 border-t">
            <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Try It Yourself
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
