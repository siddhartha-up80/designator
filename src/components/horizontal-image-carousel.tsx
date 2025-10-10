"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { imageService, ImagePair } from "@/lib/image-service";
import { ChevronLeft, ChevronRight, Eye, Sparkles } from "lucide-react";

interface HorizontalImageCarouselProps {
  title?: string;
  subtitle?: string;
  showBadge?: boolean;
  badgeText?: string;
  autoScrollSpeed?: number; // in milliseconds
  className?: string;
}

export function HorizontalImageCarousel({
  title = "Our AI-Generated Showcase",
  subtitle = "See how our AI transforms products into stunning model presentations",
  showBadge = true,
  badgeText = "AI-Powered Results",
  autoScrollSpeed = 3000,
  className = "",
}: HorizontalImageCarouselProps) {
  const [images, setImages] = useState<ImagePair[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImagePair | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load images from image service
  useEffect(() => {
    const loadImages = async () => {
      try {
        console.log("Loading images for horizontal carousel...");
        const imagePairs = await imageService.getAvailableImagePairs();
        console.log("Loaded image pairs:", imagePairs);
        setImages(imagePairs);
      } catch (error) {
        console.error("Failed to load images:", error);
        // Fallback to some default images
        setImages([
          {
            id: 1,
            modelImage: "model (1).jpg",
            productImage: "product (1).png",
            modelImagePath: "/images/model (1).jpg",
            productImagePath: "/images/product (1).png",
          },
          {
            id: 2,
            modelImage: "model (2).jpg",
            productImage: "product (2).png",
            modelImagePath: "/images/model (2).jpg",
            productImagePath: "/images/product (2).png",
          },
          {
            id: 3,
            modelImage: "model (3).jpg",
            productImage: "product (3).png",
            modelImagePath: "/images/model (3).jpg",
            productImagePath: "/images/product (3).png",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (images.length === 0 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % images.length;
        // Smooth scroll to the next image
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const imageWidth = 280; // width + gap
          const scrollPosition = nextIndex * imageWidth;
          container.scrollTo({
            left: scrollPosition,
            behavior: "smooth",
          });
        }
        return nextIndex;
      });
    }, autoScrollSpeed);

    return () => clearInterval(interval);
  }, [images.length, isHovered, autoScrollSpeed]);

  const handleImageClick = (image: ImagePair) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  const scrollToIndex = (index: number) => {
    setCurrentIndex(index);
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const imageWidth = 280;
      const scrollPosition = index * imageWidth;
      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    scrollToIndex(nextIndex);
  };

  if (loading) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-8">
            {showBadge && (
              <Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100">
                <Sparkles className="w-4 h-4 mr-2" />
                {badgeText}
              </Badge>
            )}
            <h2 className="text-4xl font-bold">{title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-rose-500 border-t-transparent"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className={`py-16 overflow-hidden ${className}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-8 mb-12">
            {showBadge && (
              <Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100">
                <Sparkles className="w-4 h-4 mr-2" />
                {badgeText}
              </Badge>
            )}
            <h2 className="text-4xl font-bold">{title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>

          <div className="relative">
            {/* Navigation buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
              onClick={handleNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Scrolling container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Duplicate images for infinite scroll effect */}
              {[...images, ...images, ...images].map((image, index) => (
                <div
                  key={`${image.id}-${Math.floor(index / images.length)}`}
                  className="flex-shrink-0 group cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    {/* Model image */}
                    <div className="w-64 h-80 overflow-hidden">
                      <img
                        src={image.modelImagePath}
                        alt={`Model wearing ${image.productImage}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Product image overlay */}
                    <div className="absolute top-4 right-4 w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-lg bg-white">
                      <img
                        src={image.productImagePath}
                        alt={`Product ${image.productImage}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/90 text-black hover:bg-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <h3 className="font-medium text-sm">
                      AI Model Presentation
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Product #{image.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  title={`Go to image ${index + 1}`}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentIndex
                      ? "bg-rose-500"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  onClick={() => scrollToIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Image Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {selectedImage && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Model Image */}
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <img
                    src={selectedImage.modelImagePath}
                    alt={`Model wearing ${selectedImage.productImage}`}
                    className="w-full h-96 md:h-[500px] object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">
                    AI Generated Model
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Professional model presentation created using advanced AI
                    technology. No photoshoot required.
                  </p>
                </div>
              </div>

              {/* Product Image */}
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800">
                  <img
                    src={selectedImage.productImagePath}
                    alt={`Product ${selectedImage.productImage}`}
                    className="w-full h-96 md:h-[500px] object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">
                    Original Product
                  </Badge>
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
