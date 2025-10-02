"use client";

import { cn } from "@/lib/utils";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Zap,
  Settings,
  Sparkles,
  Loader2,
  RefreshCw,
  Download,
} from "lucide-react";
import { ImageUpload } from "@/components/image-upload";
import { useCredits } from "@/contexts/credits-context";
import { CostPreview } from "@/components/cost-preview";
import { CREDIT_COSTS } from "@/lib/credits-service";
import { showToast } from "@/lib/toast";

interface ProductModelFormProps {
  activeStep: string;
  onStepChange: (step: string) => void;
  onUploadComplete?: (uploadedImageUrl: string) => void;
}

export function ProductModelForm({
  activeStep,
  onStepChange,
  onUploadComplete,
}: ProductModelFormProps) {
  // Credits context for real-time updates
  const { updateCredits } = useCredits();

  const [mode, setMode] = useState("fully-automatic");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [styleInstructions, setStyleInstructions] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [imageUpdatePrompt, setImageUpdatePrompt] = useState("");
  const [isUpdatingImages, setIsUpdatingImages] = useState(false);
  const [numberOfOutputs, setNumberOfOutputs] = useState(2);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
    if (onUploadComplete) {
      onUploadComplete(imageUrl);
    }
  };

  const handleGenerateModels = async () => {
    if (!uploadedImageUrl) {
      showToast.warning("Please upload a product image first");
      return;
    }

    setIsGeneratingPrompt(true);
    onStepChange("prompts");

    try {
      // Simulate enhanced prompt generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const generatedPrompt = `Professional model wearing the product in a modern studio setting with soft lighting and clean background. Style: ${
        styleInstructions || "contemporary fashion photography"
      }. High quality, detailed, commercial photography style.`;
      setEnhancedPrompt(generatedPrompt);

      setIsGeneratingPrompt(false);

      if (mode === "fully-automatic") {
        // Auto proceed to image generation for full-auto mode
        setTimeout(() => {
          handleImageGeneration(generatedPrompt);
        }, 1000);
      }
    } catch (error) {
      console.error("Error generating prompt:", error);
      setIsGeneratingPrompt(false);
    }
  };

  const handleImageGeneration = async (prompt: string = enhancedPrompt) => {
    if (!prompt) return;

    setIsGeneratingImages(true);
    onStepChange("images");

    try {
      const response = await fetch("/api/generate-models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadedImageUrl,
          prompt: prompt,
          numberOfOutputs: numberOfOutputs,
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
        throw new Error(data.error || "Failed to generate images");
      }

      if (
        data.success &&
        data.generatedImages &&
        data.generatedImages.length > 0
      ) {
        // Convert all generated images to data URLs
        const imageDataUrls = data.generatedImages.map(
          (imageData: string) => `data:image/png;base64,${imageData}`
        );
        setGeneratedImages(imageDataUrls);
      } else if (data.success && data.generatedImage) {
        // Fallback for single image response (backward compatibility)
        const imageDataUrl = `data:image/png;base64,${data.generatedImage}`;
        setGeneratedImages([imageDataUrl]);
      }
    } catch (error) {
      console.error("Error generating images:", error);
      showToast.error("Failed to generate images", "Please try again.");
    } finally {
      setIsGeneratingImages(false);
    }
  };

  const handleUpdateImages = async () => {
    if (!imageUpdatePrompt.trim()) {
      showToast.warning("Please enter update instructions");
      return;
    }

    if (generatedImages.length === 0) {
      showToast.warning("No images to update");
      return;
    }

    setIsUpdatingImages(true);

    try {
      const updatedImages = [];

      // Update each image individually
      for (let i = 0; i < generatedImages.length; i++) {
        const response = await fetch("/api/generate-models", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: uploadedImageUrl,
            referenceImageUrl: generatedImages[i], // Use each image as its own reference
            prompt: enhancedPrompt,
            updateInstructions: imageUpdatePrompt,
            numberOfOutputs: 1, // Update one image at a time
            isUpdate: true,
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
          console.error(`Failed to update image ${i + 1}:`, data.error);
          // Keep the original image if update fails
          updatedImages.push(generatedImages[i]);
          continue;
        }

        if (data.success && data.generatedImage) {
          const imageDataUrl = `data:image/png;base64,${data.generatedImage}`;
          updatedImages.push(imageDataUrl);
        } else if (
          data.success &&
          data.generatedImages &&
          data.generatedImages.length > 0
        ) {
          const imageDataUrl = `data:image/png;base64,${data.generatedImages[0]}`;
          updatedImages.push(imageDataUrl);
        } else {
          // Keep the original image if no valid response
          updatedImages.push(generatedImages[i]);
        }
      }

      // Update all images at once
      setGeneratedImages(updatedImages);
      setImageUpdatePrompt("");
    } catch (error) {
      console.error("Error updating images:", error);
      showToast.error("Failed to update images", "Please try again.");
    } finally {
      setIsUpdatingImages(false);
    }
  };

  const handleFinalizeOutput = () => {
    onStepChange("output");
  };

  const handleDownloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `generated-model-${index + 1}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderInputStep = () => (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Image Upload */}
          <div className="space-y-6">
            <Card className="p-6 bg-white shadow-sm border border-gray-200">
              <div className="space-y-6">
                {/* Upload Product Image */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-3 block">
                    Upload Product Image <span className="text-red-500">*</span>
                  </label>
                  <ImageUpload
                    onImageUploaded={handleImageUpload}
                    uploadedImageUrl={uploadedImageUrl}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Style Instructions */}
          <div className="space-y-6">
            <Card className="p-6 bg-white shadow-sm border border-gray-200">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-3 block">
                    Style Instructions{" "}
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <Textarea
                    value={styleInstructions}
                    onChange={(e) => setStyleInstructions(e.target.value)}
                    placeholder="background should be yellow"
                    className="min-h-[200px] resize-none text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Describe the style, background, lighting, pose, or setting
                    you want for your model photos.
                  </p>
                </div>

                {/* Mode Selection */}
                {uploadedImageUrl && (
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-3 block">
                      Generation Mode <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3 mb-4">
                      <Button
                        onClick={() => setMode("fully-automatic")}
                        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                          mode === "fully-automatic"
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                      >
                        <span>⚡</span> Full Auto
                      </Button>
                      <Button
                        onClick={() => setMode("semi-automatic")}
                        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                          mode === "semi-automatic"
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                      >
                        <span>⚙️</span> Custom
                      </Button>
                    </div>
                  </div>
                )}

                {/* Number of Images */}
                {uploadedImageUrl && (
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-3 block">
                      Number of Images <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      {[1, 2, 4].map((num) => (
                        <Button
                          key={num}
                          variant={
                            numberOfOutputs === num ? "default" : "outline"
                          }
                          className={`px-6 py-2 rounded-md text-sm font-medium ${
                            numberOfOutputs === num
                              ? "bg-orange-500 hover:bg-orange-600 text-white"
                              : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                          }`}
                          onClick={() => setNumberOfOutputs(num)}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                {uploadedImageUrl && (
                  <Button
                    onClick={handleGenerateModels}
                    disabled={isGeneratingPrompt}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingPrompt ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <span>✨</span> Generate Model Images
                        <span className="opacity-90">
                          (
                          <CostPreview
                            baseRate={CREDIT_COSTS.PHOTO_GENERATION}
                            quantity={numberOfOutputs}
                          />
                          )
                        </span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPromptsStep = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-screen">
          {/* Left Sidebar Form */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 bg-white shadow-sm border border-gray-200">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-3 block">
                    Enhanced Prompt <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    {mode === "semi-automatic"
                      ? "Review and edit the AI-generated prompt before proceeding"
                      : "AI-generated prompt (auto-proceeding to image generation)"}
                  </p>

                  {isGeneratingPrompt ? (
                    <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-sm text-gray-600">
                          Generating enhanced prompt...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Textarea
                      value={enhancedPrompt}
                      onChange={(e) => setEnhancedPrompt(e.target.value)}
                      disabled={mode === "fully-automatic"}
                      className={cn(
                        "min-h-[120px] resize-none text-sm",
                        mode === "fully-automatic" && "bg-gray-50 text-gray-600"
                      )}
                      placeholder="Enhanced prompt will appear here..."
                    />
                  )}
                </div>

                {mode === "semi-automatic" &&
                  enhancedPrompt &&
                  !isGeneratingPrompt && (
                    <Button
                      onClick={() => handleImageGeneration()}
                      disabled={isGeneratingImages}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingImages ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Generating Images...
                        </>
                      ) : (
                        <>
                          <span>✨</span> Generate Images with This Prompt
                        </>
                      )}
                    </Button>
                  )}

                {mode === "fully-automatic" &&
                  enhancedPrompt &&
                  !isGeneratingImages && (
                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-sm text-orange-700">
                        Auto-proceeding to image generation...
                      </p>
                    </div>
                  )}
              </div>
            </Card>
          </div>

          {/* Right Preview Area */}
          <div className="lg:col-span-3">
            <Card className="h-[70vh] bg-white shadow-sm border border-gray-200">
              <div className="p-6 h-full flex flex-col">
                <div className="flex-1 bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden">
                  {uploadedImageUrl ? (
                    <div className="w-full h-full flex flex-col">
                      {/* Uploaded Image */}
                      <div className="flex items-center justify-center p-4 h-full">
                        <img
                          src={uploadedImageUrl}
                          alt="Uploaded product"
                          className="rounded-lg shadow-md max-h-full w-auto object-contain"
                          style={{ maxHeight: "100%" }}
                        />
                      </div>

                      {/* Custom Style Instructions */}
                      {styleInstructions && (
                        <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4">
                          <div className="text-center">
                            <h4 className="text-sm font-medium text-gray-800 mb-2">
                              Custom Style Instructions
                            </h4>
                            <p className="text-xs text-gray-600 italic">
                              "{styleInstructions}"
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-orange-400 text-6xl mb-4">📝</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Prompt Enhancement
                      </h3>
                      <p className="text-gray-600 text-center text-sm max-w-md">
                        {isGeneratingPrompt
                          ? "AI is creating an enhanced prompt for better results..."
                          : enhancedPrompt
                          ? "Prompt ready! Review and proceed to image generation."
                          : "Waiting for prompt generation to complete..."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  const renderImagesStep = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-screen">
          {/* Left Sidebar Form */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 bg-white shadow-sm border border-gray-200">
              <div className="space-y-6">
                {/* Image Update Section */}
                {generatedImages.length > 0 && !isGeneratingImages && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-900 mb-3 block">
                        Update Images{" "}
                        <span className="text-gray-400 font-normal">
                          (Optional)
                        </span>
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        Not satisfied with the results? Describe how you'd like
                        to modify the images.
                      </p>
                      <Textarea
                        value={imageUpdatePrompt}
                        onChange={(e) => setImageUpdatePrompt(e.target.value)}
                        placeholder="e.g., make the lighting brighter, change the pose to more casual, add a smile..."
                        className="min-h-[80px] resize-none text-sm"
                      />
                    </div>

                    <Button
                      onClick={handleUpdateImages}
                      disabled={isUpdatingImages || !imageUpdatePrompt.trim()}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdatingImages ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Updating Images...
                        </>
                      ) : (
                        <>
                          <span>🔄</span> Update Images
                        </>
                      )}
                    </Button>
                  </>
                )}

                {/* Proceed Button */}
                {generatedImages.length > 0 && !isGeneratingImages && (
                  <Button
                    onClick={handleFinalizeOutput}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 py-3 rounded-lg text-base font-semibold flex items-center justify-center gap-2 bg-white hover:bg-gray-50"
                  >
                    <span>📥</span> Proceed to Output
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Right Preview Area */}
          <div className="lg:col-span-3">
            <Card className="h-full bg-white shadow-sm border border-gray-200">
              {/* Top Actions */}
              {generatedImages.length > 0 && !isGeneratingImages && (
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Generated Model Images
                  </h3>
                </div>
              )}

              {/* Main Preview Area */}
              <div className="p-6 h-full flex flex-col">
                <div className="flex-1 min-h-[400px] bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden">
                  {isGeneratingImages ? (
                    <div className="text-center">
                      <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Generating Your Model Images
                      </h3>
                      <p className="text-gray-600 text-center text-sm max-w-md">
                        AI is creating professional model photos... This may
                        take a few moments.
                      </p>
                    </div>
                  ) : generatedImages.length > 0 ? (
                    <div className="w-full h-full p-4 flex flex-col">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        {generatedImages.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`Generated model ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg shadow-md"
                            />
                            {/* Download Icon */}
                            <button
                              onClick={() =>
                                handleDownloadImage(imageUrl, index)
                              }
                              className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                              title={`Download image ${index + 1}`}
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                              AI Generated #{index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Download All Button */}
                      <div className="mt-4 flex justify-center">
                        <Button
                          onClick={() => {
                            generatedImages.forEach((imageUrl, index) => {
                              handleDownloadImage(imageUrl, index);
                            });
                          }}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download All ({generatedImages.length})
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-orange-400 text-6xl mb-4">🎨</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Image Generation
                      </h3>
                      <p className="text-gray-600 text-center text-sm max-w-md">
                        Generated model images will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOutputStep = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-screen">
          {/* Left Sidebar Form */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 bg-white shadow-sm border border-gray-200">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Final Output Ready
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Your generated model images are ready for download and use.
                  </p>
                </div>

                {/* Download All Button */}
                {generatedImages.length > 0 && (
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        generatedImages.forEach((imageUrl, index) => {
                          handleDownloadImage(imageUrl, index);
                        });
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg text-base font-semibold flex items-center justify-center gap-2"
                    >
                      <span>📥</span> Download All Images
                    </Button>

                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        Or download individual images from the preview area
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Preview Area */}
          <div className="lg:col-span-3">
            <Card className="h-full bg-white shadow-sm border border-gray-200">
              {/* Top Actions */}
              {generatedImages.length > 0 && (
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Final Results ({generatedImages.length} images)
                  </h3>
                </div>
              )}

              {/* Main Preview Area */}
              <div className="p-6 h-full flex flex-col">
                <div className="flex-1 min-h-[400px] bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden">
                  {generatedImages.length > 0 ? (
                    <div className="w-full h-full p-4 flex flex-col">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        {generatedImages.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`Final model ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg shadow-md"
                            />
                            {/* Download Icon */}
                            <button
                              onClick={() =>
                                handleDownloadImage(imageUrl, index)
                              }
                              className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                              title={`Download image ${index + 1}`}
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                              Final Result #{index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Download All Button */}
                      <div className="mt-4 flex justify-center">
                        <Button
                          onClick={() => {
                            generatedImages.forEach((imageUrl, index) => {
                              handleDownloadImage(imageUrl, index);
                            });
                          }}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download All ({generatedImages.length})
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-green-400 text-6xl mb-4">🎯</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        No Final Images
                      </h3>
                      <p className="text-gray-600 text-center text-sm max-w-md">
                        No final images available for display
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  // Render different content based on active step
  switch (activeStep) {
    case "input":
      return renderInputStep();
    case "prompts":
      return renderPromptsStep();
    case "images":
      return renderImagesStep();
    case "output":
      return renderOutputStep();
    default:
      return renderInputStep();
  }
}
