"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useEdgeStore } from "@/lib/edgestore";
import { FeatureCreditCost } from "@/components/credits-badge";
import { CREDIT_COSTS } from "@/lib/credits-service";
import { useCredits } from "@/contexts/credits-context";
import { CostPreview } from "@/components/cost-preview";
import { showToast } from "@/lib/toast";
import Image from "next/image";
import { Shirt } from "lucide-react";

interface UploadedImage {
  file: File;
  preview: string;
  url?: string;
}

const FashionTryOnPage = () => {
  // Credits context for real-time updates
  const { updateCredits } = useCredits();

  const [selectedNumImages, setSelectedNumImages] = useState(1);
  const [zoomLevel, setZoomLevel] = useState([100]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Model selection states
  const [modelSelectionTab, setModelSelectionTab] = useState<
    "upload" | "select"
  >("upload");
  const [availableModelsTab, setAvailableModelsTab] = useState<
    "all" | "favorites"
  >("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Image states
  const [modelImage, setModelImage] = useState<UploadedImage | null>(null);
  const [garmentImage, setGarmentImage] = useState<UploadedImage | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<UploadedImage | null>(
    null
  );
  const [resultImage, setResultImage] = useState<string | null>(null);

  // File input refs
  const modelInputRef = useRef<HTMLInputElement>(null);
  const garmentInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const { edgestore } = useEdgeStore();

  // File upload handler
  const handleFileUpload = useCallback(
    async (
      file: File,
      setImage: React.Dispatch<React.SetStateAction<UploadedImage | null>>,
      imageType: string
    ) => {
      try {
        setError(null);
        // Create preview
        const preview = URL.createObjectURL(file);
        setImage({ file, preview });

        // Upload to EdgeStore
        const res = await edgestore.publicFiles.upload({ file });
        // Update with URL
        setImage((prev) => (prev ? { ...prev, url: res.url } : null));
      } catch (err) {
        console.error(`Error uploading ${imageType}:`, err);
        setError(`Failed to upload ${imageType}. Please try again.`);
      }
    },
    [edgestore]
  );

  // Handle file selection
  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<UploadedImage | null>>,
    imageType: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, setImage, imageType);
    }
  };

  // Handle drag and drop
  const handleDrop = useCallback(
    (
      event: React.DragEvent<HTMLDivElement>,
      setImage: React.Dispatch<React.SetStateAction<UploadedImage | null>>,
      imageType: string
    ) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleFileUpload(file, setImage, imageType);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Try-on functionality
  const handleTryOn = async () => {
    if (!modelImage?.url || !garmentImage?.url) {
      showToast.warning(
        "Please upload both model and garment images before trying on"
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const response = await fetch("/api/fashion-try-on", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personImageUrl: modelImage.url,
          clothingImageUrl: garmentImage.url,
          backgroundImageUrl: backgroundImage?.url,
          numberOfImages: selectedNumImages,
        }),
      });

      // Update credits from response header
      const remainingCredits = response.headers.get("X-Remaining-Credits");
      if (remainingCredits !== null) {
        const credits = parseInt(remainingCredits, 10);
        if (!isNaN(credits)) {
          updateCredits(credits);
        }
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to process try-on");
      }

      if (data.success && data.resultImageUrl) {
        setResultImage(data.resultImageUrl);
      } else {
        throw new Error(data.error || "No result image generated");
      }
    } catch (err) {
      console.error("Try-on error:", err);
      setError(err instanceof Error ? err.message : "Failed to process try-on");
    } finally {
      setIsLoading(false);
    }
  };

  // Download functionality
  const handleDownload = () => {
    if (!resultImage) return;

    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `fashion-try-on-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel([Math.min(zoomLevel[0] + 10, 200)]);
  };

  const handleZoomOut = () => {
    setZoomLevel([Math.max(zoomLevel[0] - 10, 50)]);
  };

  // Refresh models functionality
  const handleRefreshModels = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call to refresh models
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Here you would typically fetch the latest models from your API
    } catch (err) {
      console.error("Failed to refresh models:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Shirt className="h-6 w-6 text-primary" />
            Fashion Try-On
            <FeatureCreditCost cost={CREDIT_COSTS.PHOTO_GENERATION} size="md" />
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Virtually try garments on models with AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-screen">
          {/* Left Sidebar Form */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 bg-white shadow-sm border border-gray-200">
              <div className="space-y-6">
                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Model Selection Section */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-3 block">
                    Model Selection <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3 mb-4">
                    <Button
                      onClick={() => setModelSelectionTab("upload")}
                      className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                        modelSelectionTab === "upload"
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <span>📤</span> Upload Model
                    </Button>
                    <Button
                      onClick={() => setModelSelectionTab("select")}
                      className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                        modelSelectionTab === "select"
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <span>📁</span> Select Model
                    </Button>
                  </div>

                  {/* Select Model Tab Content */}
                  {modelSelectionTab === "select" && (
                    <div className="space-y-4">
                      {/* Available Models Header */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">
                          Available Models:
                        </span>
                        <Button
                          onClick={handleRefreshModels}
                          disabled={isRefreshing}
                          variant="outline"
                          size="sm"
                          className="text-orange-500 border-orange-200 hover:bg-orange-50 text-xs"
                        >
                          {isRefreshing ? (
                            <div className="animate-spin w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full mr-1"></div>
                          ) : (
                            <span className="mr-1">�</span>
                          )}
                          Refresh
                        </Button>
                      </div>

                      {/* All/Favorites Tabs */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setAvailableModelsTab("all")}
                          variant={
                            availableModelsTab === "all" ? "default" : "outline"
                          }
                          size="sm"
                          className={`text-sm ${
                            availableModelsTab === "all"
                              ? "bg-orange-500 hover:bg-orange-600 text-white"
                              : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                          }`}
                        >
                          <span className="mr-1">📋</span> All
                        </Button>
                        <Button
                          onClick={() => setAvailableModelsTab("favorites")}
                          variant={
                            availableModelsTab === "favorites"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className={`text-sm ${
                            availableModelsTab === "favorites"
                              ? "bg-orange-500 hover:bg-orange-600 text-white"
                              : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                          }`}
                        >
                          <span className="mr-1">💝</span> Favorites
                        </Button>
                      </div>

                      {/* Models Grid - Will be populated from database */}
                      <div className="mt-4 text-center text-gray-500 text-sm">
                        <p>Available models will be loaded from the database</p>
                        <p className="text-xs mt-1">
                          Select a model to use for try-on
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Model Image - Only show when Upload tab is active */}
                {modelSelectionTab === "upload" && (
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-3 block">
                      Upload Model Image <span className="text-red-500">*</span>
                    </label>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                      onDrop={(e) =>
                        handleDrop(e, setModelImage, "model image")
                      }
                      onDragOver={handleDragOver}
                      onClick={() => modelInputRef.current?.click()}
                    >
                      {modelImage ? (
                        <div className="space-y-2">
                          <div className="relative w-20 h-20 mx-auto">
                            <Image
                              src={modelImage.preview}
                              alt="Model preview"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <p className="text-sm text-gray-600">
                            {modelImage.file.name}
                          </p>
                          <p className="text-xs text-green-600">✓ Uploaded</p>
                        </div>
                      ) : (
                        <>
                          <div className="text-orange-500 text-3xl mb-3">
                            📷
                          </div>
                          <Button
                            type="button"
                            className="bg-orange-500 hover:bg-orange-600 text-white mb-2 text-sm"
                          >
                            Choose Model Image
                          </Button>
                          <p className="text-xs text-gray-500">
                            Click to browse, drag & drop, or paste
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      ref={modelInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileSelect(e, setModelImage, "model image")
                      }
                      className="hidden"
                      aria-label="Upload model image"
                    />
                  </div>
                )}

                {/* Upload Garment Image */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-3 block">
                    Upload Garment Image <span className="text-red-500">*</span>
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                    onDrop={(e) =>
                      handleDrop(e, setGarmentImage, "garment image")
                    }
                    onDragOver={handleDragOver}
                    onClick={() => garmentInputRef.current?.click()}
                  >
                    {garmentImage ? (
                      <div className="space-y-2">
                        <div className="relative w-20 h-20 mx-auto">
                          <Image
                            src={garmentImage.preview}
                            alt="Garment preview"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          {garmentImage.file.name}
                        </p>
                        <p className="text-xs text-green-600">✓ Uploaded</p>
                      </div>
                    ) : (
                      <>
                        <div className="text-orange-500 text-3xl mb-3">👗</div>
                        <Button
                          type="button"
                          className="bg-orange-500 hover:bg-orange-600 text-white mb-2 text-sm"
                        >
                          Choose Garment Image
                        </Button>
                        <p className="text-xs text-gray-500">
                          Click to browse, drag & drop, or paste
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    ref={garmentInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileSelect(e, setGarmentImage, "garment image")
                    }
                    className="hidden"
                    aria-label="Upload garment image"
                  />
                </div>

                {/* Upload Background Image (Optional) */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-3 block">
                    Upload Background Img{" "}
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                    onDrop={(e) =>
                      handleDrop(e, setBackgroundImage, "background image")
                    }
                    onDragOver={handleDragOver}
                    onClick={() => backgroundInputRef.current?.click()}
                  >
                    {backgroundImage ? (
                      <div className="space-y-2">
                        <div className="relative w-20 h-20 mx-auto">
                          <Image
                            src={backgroundImage.preview}
                            alt="Background preview"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          {backgroundImage.file.name}
                        </p>
                        <p className="text-xs text-green-600">✓ Uploaded</p>
                      </div>
                    ) : (
                      <>
                        <div className="text-gray-400 text-3xl mb-3">📷</div>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-gray-300 text-gray-700 mb-2 text-sm bg-white"
                        >
                          Choose Background Image
                        </Button>
                        <p className="text-xs text-gray-500">
                          Click to browse, drag & drop, or paste
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    ref={backgroundInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileSelect(
                        e,
                        setBackgroundImage,
                        "background image"
                      )
                    }
                    className="hidden"
                    aria-label="Upload background image"
                  />
                </div>

                {/* Number of Images */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-3 block">
                    Number of Images <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    {[1, 2, 4].map((num) => (
                      <Button
                        key={num}
                        variant={
                          selectedNumImages === num ? "default" : "outline"
                        }
                        className={`px-6 py-2 rounded-md text-sm font-medium ${
                          selectedNumImages === num
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedNumImages(num)}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Try-On Button */}
                <Button
                  onClick={handleTryOn}
                  disabled={isLoading || !modelImage?.url || !garmentImage?.url}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span>✨</span> Try-On Now{" "}
                      <span className="opacity-90">
                        (
                        <CostPreview
                          baseRate={CREDIT_COSTS.PHOTO_GENERATION}
                          quantity={selectedNumImages}
                        />
                        )
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Preview Area */}
          <div className="lg:col-span-3">
            <Card className="h-full bg-white shadow-sm border border-gray-200">
              {/* Top Actions */}
              <div className="flex justify-end items-center p-4 border-b border-gray-200">
                <div className="flex gap-3">
                  <Button
                    onClick={handleDownload}
                    disabled={!resultImage}
                    variant="outline"
                    className="border-gray-300 text-gray-700 px-4 py-2 text-sm bg-white hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>📥</span> Download
                  </Button>
                </div>
              </div>

              {/* Main Preview Area */}
              <div className="p-6 h-full flex flex-col">
                <div className="flex-1 min-h-[400px] bg-gradient-to-br from-pink-50 to-orange-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden">
                  {isLoading ? (
                    <div className="text-center">
                      <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Processing Your Try-On
                      </h3>
                      <p className="text-gray-600 text-center text-sm max-w-md">
                        Our AI is working its magic... This may take a few
                        moments.
                      </p>
                    </div>
                  ) : resultImage ? (
                    <div
                      className="relative w-full h-full flex items-center justify-center transition-transform duration-200"
                      style={{
                        transform: `scale(${zoomLevel[0] / 100})`,
                      }}
                    >
                      <Image
                        src={resultImage}
                        alt="Fashion try-on result"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 60vw"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-orange-400 text-6xl mb-4">📷</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Start Your Try-On
                      </h3>
                      <p className="text-gray-600 text-center text-sm max-w-md">
                        Upload a model and garment image to see the magic happen
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Controls */}
                {resultImage && (
                  <div className="flex justify-end items-center mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700">
                        Zoom
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={handleZoomOut}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
                        >
                          −
                        </Button>
                        <div className="w-16">
                          <Slider
                            value={zoomLevel}
                            onValueChange={setZoomLevel}
                            max={200}
                            min={50}
                            step={10}
                            className="w-full"
                          />
                        </div>
                        <Button
                          onClick={handleZoomIn}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
                        >
                          +
                        </Button>
                        <span className="text-sm text-gray-600 min-w-10 text-center">
                          {zoomLevel[0]}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionTryOnPage;
