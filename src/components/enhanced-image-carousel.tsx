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
import { Card, CardContent } from "@/components/ui/card";
import { imageService, ImagePair } from "@/lib/image-service";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Sparkles,
  Play,
  Pause,
  Download,
  Share,
  Heart,
} from "lucide-react";
import Link from "next/link";

interface EnhancedImageCarouselProps {
  title?: string;
  subtitle?: string;
  showBadge?: boolean;
  badgeText?: string;
  autoScrollSpeed?: number;
  direction?: "left" | "right";
  showControls?: boolean;
  showProgress?: boolean;
  className?: string;
}

export function EnhancedImageCarousel({
  title = "Our AI-Generated Showcase",
  subtitle = "See how our AI transforms products into stunning model presentations",
  showBadge = true,
  badgeText = "AI-Powered Results",
  autoScrollSpeed = 3000,
  direction = "left",
  showControls = true,
  showProgress = true,
  className = "",
}: EnhancedImageCarouselProps) {
  const [images, setImages] = useState<ImagePair[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImagePair | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load images from image service
  useEffect(() => {
    const loadImages = async () => {
      try {
        console.log("Loading images for enhanced carousel...");
        const imagePairs = await imageService.getAvailableImagePairs();
        console.log("Loaded image pairs:", imagePairs);
        setImages(imagePairs);
      } catch (error) {
        console.error("Failed to load images:", error);
        // Fallback images
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

  // Progress bar and auto-scroll
  useEffect(() => {
    if (images.length === 0 || isHovered || !isPlaying) return;

    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent =
        ((elapsed % autoScrollSpeed) / autoScrollSpeed) * 100;
      setProgress(progressPercent);

      if (elapsed % autoScrollSpeed < 50) {
        // Reset threshold
        const nextIndex =
          direction === "left"
            ? (currentIndex + 1) % images.length
            : (currentIndex - 1 + images.length) % images.length;
        scrollToIndex(nextIndex);
      }
    }, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    images.length,
    isHovered,
    isPlaying,
    currentIndex,
    autoScrollSpeed,
    direction,
  ]);

  const handleImageClick = (image: ImagePair) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  const scrollToIndex = (index: number) => {
    setCurrentIndex(index);
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const imageWidth = 300; // Adjusted width
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

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleLike = (imageId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = new Set(likedImages);
    if (newLiked.has(imageId)) {
      newLiked.delete(imageId);
    } else {
      newLiked.add(imageId);
    }
    setLikedImages(newLiked);
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
            {/* Progress bar */}
            {showProgress && isPlaying && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full z-20">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-100"
                  style={
                    {
                      "--progress-width": `${progress}%`,
                      width: "var(--progress-width)",
                    } as React.CSSProperties
                  }
                />
              </div>
            )}

            {/* Controls */}
            {showControls && (
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}

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
              {/* Multiple sets for infinite feel */}
              {[...images, ...images, ...images].map((image, index) => (
                <Card
                  key={`${image.id}-${Math.floor(index / images.length)}`}
                  className="flex-shrink-0 group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  onClick={() => handleImageClick(image)}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-lg">
                      {/* Model image */}
                      <div className="w-72 h-96 overflow-hidden">
                        <img
                          src={image.modelImagePath}
                          alt={`Model wearing ${image.productImage}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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

                      {/* Like button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white"
                        onClick={(e) => toggleLike(image.id, e)}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            likedImages.has(image.id)
                              ? "fill-red-500 text-red-500"
                              : "text-white"
                          }`}
                        />
                      </Button>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="space-y-3">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white/90 text-black hover:bg-white w-full"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white"
                            >
                              <Share className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-sm">
                        AI Model #{image.id}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Professional presentation • AI Generated
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          Premium
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Heart className="w-3 h-3" />
                          <span>{Math.floor(Math.random() * 100) + 50}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  title={`Go to image ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? "bg-rose-500 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  onClick={() => scrollToIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Image Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          {selectedImage && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Model Image */}
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <img
                      src={selectedImage.modelImagePath}
                      alt={`Model wearing ${selectedImage.productImage}`}
                      className="w-full h-96 md:h-[600px] object-cover"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Badge variant="secondary">AI Generated</Badge>
                      <Badge variant="outline">High Quality</Badge>
                      <Badge variant="outline">Professional</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Professional model presentation created using advanced AI
                      technology. No expensive photoshoot required. Perfect for
                      e-commerce, marketing, and social media campaigns.
                    </p>
                  </div>
                </div>

                {/* Product Image */}
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800">
                    <img
                      src={selectedImage.productImagePath}
                      alt={`Product ${selectedImage.productImage}`}
                      className="w-full h-96 md:h-[600px] object-contain"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Badge variant="outline">Original Input</Badge>
                      <Badge variant="outline">
                        Product #{selectedImage.id}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The original product image used as input for AI model
                      generation. Our AI analyzes the product&apos;s features,
                      colors, and style to create the perfect model
                      presentation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <Link
                href={`/product-model`}
                className="w-max mx-auto flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create Your Own
                </Button>
              </Link>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
