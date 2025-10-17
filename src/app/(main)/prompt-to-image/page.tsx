"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { MultiImageUpload } from "@/components/multi-image-upload";
import { FeatureCreditCost } from "@/components/credits-badge";
import { CREDIT_COSTS } from "@/lib/credits-service";
import { useCredits } from "@/contexts/credits-context";
import { CostPreview } from "@/components/cost-preview";
import { showToast } from "@/lib/toast";
import { useDialog } from "@/components/ui/dialog-provider";
import {
  Wand2,
  Sparkles,
  Eye,
  Settings,
  Download,
  Copy,
  ChevronDown,
  ChevronRight,
  Loader2,
  Image as ImageIcon,
  FileText,
  Palette,
  ArrowLeft,
  RotateCcw,
  Zap,
  Trash2,
  Save,
} from "lucide-react";

const imageStyles = [
  {
    id: "photorealistic",
    name: "Photorealistic",
    description: "Realistic photography style",
    preview:
      "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=120&q=80&auto=format&fit=crop",
  },
  {
    id: "artistic",
    name: "Artistic",
    description: "Painted, artistic style",
    preview:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&q=80&auto=format&fit=crop",
  },
  {
    id: "anime",
    name: "Anime",
    description: "Japanese animation style",
    preview:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&q=80&auto=format&fit=crop",
  },
  {
    id: "digital-art",
    name: "Digital Art",
    description: "Modern digital artwork",
    preview:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=120&q=80&auto=format&fit=crop",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    description: "Magical, fantasy style",
    preview:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=120&q=80&auto=format&fit=crop",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean, simple design",
    preview:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=120&q=80&auto=format&fit=crop",
  },
];

const aspectRatios = [
  { id: "1:1", name: "Square", ratio: "1:1" },
  { id: "16:9", name: "Landscape", ratio: "16:9" },
  { id: "9:16", name: "Portrait", ratio: "9:16" },
  { id: "4:3", name: "Classic", ratio: "4:3" },
  { id: "3:2", name: "Photo", ratio: "3:2" },
];

type Step = "INPUT" | "GENERATE";

interface UploadedImage {
  id: string;
  url: string;
  file: File;
}

export default function PromptToImagePage() {
  const searchParams = useSearchParams();
  const { confirm } = useDialog();

  // Flow state
  const [step, setStep] = useState<Step>("INPUT");

  // Input states
  const [textPrompt, setTextPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  // Generation settings
  const [selectedStyle, setSelectedStyle] = useState("photorealistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [numberOfImages, setNumberOfImages] = useState([1]);
  const [guidanceScale, setGuidanceScale] = useState([7.5]);
  const [steps, setSteps] = useState([20]);

  // Results
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // Credits context for real-time updates
  const { updateCredits } = useCredits();

  // UI toggles for collapsible groups
  const [openStyles, setOpenStyles] = useState(true);
  const [openSettings, setOpenSettings] = useState(true);
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [openTips, setOpenTips] = useState(false);

  // Handle incoming prompt from URL parameters
  useEffect(() => {
    const promptFromUrl = searchParams.get("prompt");
    if (promptFromUrl) {
      setTextPrompt(decodeURIComponent(promptFromUrl));
      // Keep on INPUT step so user can click generate
      setStep("INPUT");
    }
  }, [searchParams]);

  // Navigation actions
  const goToInput = () => {
    setGeneratedImages([]);
    setError("");
    setStep("INPUT");
  };

  const handleGenerate = async () => {
    if (!textPrompt.trim() && uploadedImages.length === 0) {
      showToast.warning(
        "Please enter a text prompt or upload at least one image"
      );
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/prompt-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          generationMode: "text-to-image",
          textPrompt: textPrompt.trim(),
          negativePrompt: negativePrompt.trim(),
          // Add support for multiple reference images in text-to-image mode
          referenceImages: uploadedImages.map((img) => img.url),
          imageStyle: selectedStyle,
          aspectRatio,
          numberOfImages: numberOfImages[0],
          guidanceScale: guidanceScale[0],
          steps: steps[0],
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

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to generate images");
      }

      if (result.success && result.images) {
        setGeneratedImages(result.images);
        setStep("GENERATE");
      } else {
        throw new Error("No images received from the API");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      showToast.error("Failed to generate images", errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(textPrompt);
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `generated-image-${index + 1}-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const saveToGallery = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch("/api/gallery/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `Prompt to Image ${new Date().toLocaleDateString()} - ${
            index + 1
          }`,
          imageUrl: imageUrl,
          type: "PROMPT_TO_IMAGE",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save image");
      }

      showToast.success(
        "Saved to Gallery",
        `Image ${index + 1} saved successfully`
      );
    } catch (error) {
      console.error("Error saving to gallery:", error);
      showToast.error("Failed to save", "Could not save image to gallery");
    }
  };

  const saveAllToGallery = async () => {
    if (generatedImages.length === 0) {
      showToast.warning("No images to save");
      return;
    }

    try {
      let successCount = 0;
      for (let i = 0; i < generatedImages.length; i++) {
        const response = await fetch("/api/gallery/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: `Prompt to Image ${new Date().toLocaleDateString()} - ${
              i + 1
            }`,
            imageUrl: generatedImages[i],
            type: "PROMPT_TO_IMAGE",
          }),
        });

        if (response.ok) {
          successCount++;
        }
      }

      if (successCount === generatedImages.length) {
        showToast.success(
          "All Saved",
          `${successCount} images saved to gallery`
        );
      } else if (successCount > 0) {
        showToast.warning(
          "Partially saved",
          `${successCount} of ${generatedImages.length} saved`
        );
      } else {
        throw new Error("Failed to save images");
      }
    } catch (error) {
      console.error("Error saving to gallery:", error);
      showToast.error("Failed to save", "Could not save images to gallery");
    }
  };

  const resetAll = async () => {
    const confirmed = await confirm(
      "Reset All Settings?",
      "This will clear all your inputs, settings, and generated images. This action cannot be undone."
    );

    if (confirmed) {
      setTextPrompt("");
      setNegativePrompt("");
      setUploadedImages([]);
      setGeneratedImages([]);
      setError("");
      setSelectedStyle("photorealistic");
      setAspectRatio("1:1");
      setNumberOfImages([1]);
      setGuidanceScale([7.5]);
      setSteps([20]);
      setStep("INPUT");
      showToast.success(
        "Settings Reset",
        "All settings have been restored to default"
      );
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="mx-auto max-w-[1400px]">
        {/* Top bar - Mobile optimized */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold flex flex-wrap items-center gap-1.5 sm:gap-2">
                <Wand2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <span className="truncate">Prompt to Image</span>
                <FeatureCreditCost cost={CREDIT_COSTS.TEXT_PROMPT} size="md" />
              </h1>
            </div>

            {/* Step-aware actions - Hidden on mobile, shown on tablet+ */}
            <div className="hidden sm:flex gap-2 flex-shrink-0">
              {step === "GENERATE" ? (
                <Button variant="outline" size="sm" onClick={goToInput}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  New Generation
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={resetAll}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset All
                </Button>
              )}
            </div>
          </div>

          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
            Generate stunning images from text prompts or transform existing
            images with AI. Create artwork, photos, and designs with advanced AI
            models.
          </p>

          {/* Mobile-only action buttons */}
          <div className="flex sm:hidden gap-2 mt-3">
            {step === "GENERATE" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={goToInput}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                New Generation
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={resetAll}
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All
              </Button>
            )}
          </div>
        </div>

        {/* Main layout: Responsive stacking */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3 sm:gap-4">
          {/* Center column */}
          <div className="space-y-3 sm:space-y-4 order-1 lg:order-1 pb-24 lg:pb-0">
            {step === "INPUT" && (
              <>
                {/* Text Prompt Input - Mobile optimized - Now at top */}
                <Card>
                  <CardHeader className="py-3 px-3 sm:px-6">
                    <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                      Text & Image Input
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium">
                        Describe what you want to generate
                      </label>
                      <Textarea
                        placeholder="A beautiful sunset over mountains, photorealistic, high quality, detailed landscape..."
                        value={textPrompt}
                        onChange={(e) => setTextPrompt(e.target.value)}
                        rows={4}
                        className="resize-none text-sm"
                      />
                    </div>

                    {/* Multi-Image Upload */}
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium flex items-center gap-2">
                        <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Reference Images (Optional)
                        {uploadedImages.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {uploadedImages.length} uploaded
                          </Badge>
                        )}
                      </label>
                      <MultiImageUpload
                        uploadedImages={uploadedImages}
                        onImagesChange={setUploadedImages}
                        maxImages={5}
                      />
                      <p className="text-xs text-muted-foreground">
                        {uploadedImages.length > 0
                          ? `Using ${uploadedImages.length} reference image${
                              uploadedImages.length > 1 ? "s" : ""
                            } to guide generation along with your text prompt.`
                          : "Add reference images to guide the generation. Works great with text prompts!"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium">
                        Negative Prompt (Optional)
                      </label>
                      <Textarea
                        placeholder="What you don't want in the image: blurry, low quality, distorted..."
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        rows={2}
                        className="resize-none text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Describe what you want to avoid in the generated image
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Generate Button - Desktop only (inline) */}
                <Card className="hidden lg:block">
                  <CardContent className="pt-6 pb-6 space-y-3 px-6">
                    <Button
                      className="w-full h-12 text-base font-semibold"
                      onClick={handleGenerate}
                      disabled={
                        isGenerating ||
                        (!textPrompt.trim() && uploadedImages.length === 0)
                      }
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          <span className="truncate">
                            Generating {numberOfImages[0]} image
                            {numberOfImages[0] > 1 ? "s" : ""}...
                          </span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-5 w-5 mr-2" />
                          <span className="truncate">
                            Generate {numberOfImages[0]} Image
                            {numberOfImages[0] > 1 ? "s" : ""}
                          </span>
                          <span className="opacity-90 ml-1">
                            (
                            <CostPreview
                              baseRate={CREDIT_COSTS.TEXT_PROMPT}
                              quantity={numberOfImages[0]}
                            />
                            )
                          </span>
                        </>
                      )}
                    </Button>

                    {/* Clear All Button */}
                    {(textPrompt.trim() ||
                      uploadedImages.length > 0 ||
                      negativePrompt.trim()) && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={resetAll}
                        disabled={isGenerating}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {step === "GENERATE" && (
              <>
                {/* Input Preview Card - Mobile optimized */}
                <Card className="overflow-hidden">
                  <div className="flex items-center justify-between px-3 sm:px-4 pt-3 sm:pt-4">
                    <h3 className="text-sm sm:text-base font-medium">
                      Input Used
                    </h3>
                    <Button
                      size="sm"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="text-xs sm:text-sm"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 animate-spin" />
                          <span className="hidden sm:inline">
                            Generating...
                          </span>
                          <span className="sm:hidden">...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                          Regenerate
                        </>
                      )}
                    </Button>
                  </div>

                  <CardContent className="pt-3 sm:pt-4 px-3 sm:px-6">
                    <div className="space-y-3 sm:space-y-4">
                      {textPrompt && (
                        <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
                          <p className="text-xs sm:text-sm leading-relaxed break-words">
                            {textPrompt}
                          </p>
                          {negativePrompt && (
                            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t">
                              <p className="text-xs text-muted-foreground break-words">
                                <strong>Negative:</strong> {negativePrompt}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {uploadedImages.length > 0 && (
                        <div>
                          <p className="text-xs font-medium mb-2 text-muted-foreground">
                            Reference Images ({uploadedImages.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {uploadedImages.map((image) => (
                              <div
                                key={image.id}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border bg-background"
                              >
                                <img
                                  src={image.url}
                                  alt={`Reference ${image.file.name}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Generated Images - Mobile optimized */}
                {generatedImages.length > 0 && (
                  <Card>
                    <CardHeader className="py-3 px-3 sm:px-6">
                      <CardTitle className="flex items-center justify-between text-sm sm:text-base flex-wrap gap-2">
                        <span className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          Generated Images ({generatedImages.length})
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {selectedStyle.charAt(0).toUpperCase() +
                            selectedStyle.slice(1)}{" "}
                          Style
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {generatedImages.map((imageUrl, index) => (
                          <div key={index} className="space-y-2">
                            <div className="relative group rounded-lg overflow-hidden border">
                              <img
                                src={imageUrl}
                                alt={`Generated ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {/* Desktop hover overlay */}
                              <div className="hidden sm:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => saveToGallery(imageUrl, index)}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => downloadImage(imageUrl, index)}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </div>
                            {/* Mobile action buttons below image */}
                            <div className="flex items-center justify-between gap-2">
                              <Badge variant="outline" className="text-xs">
                                Image {index + 1}
                              </Badge>
                              <div className="flex gap-1.5 sm:gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 border-green-600 hover:bg-green-50 text-xs h-8 px-2 sm:px-3"
                                  onClick={() => saveToGallery(imageUrl, index)}
                                >
                                  <Save className="h-3 w-3 sm:mr-1" />
                                  <span className="hidden sm:inline">
                                    Gallery
                                  </span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-8 px-2 sm:px-3"
                                  onClick={() => downloadImage(imageUrl, index)}
                                >
                                  <Download className="h-3 w-3 sm:mr-1" />
                                  <span className="hidden sm:inline">
                                    Download
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions - Mobile optimized */}
                <Card>
                  <CardHeader className="py-3 px-3 sm:px-6">
                    <CardTitle className="text-sm sm:text-base">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3 sm:pb-4 px-3 sm:px-6">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={generatedImages.length === 0}
                        className="text-green-600 border-green-600 hover:bg-green-50 text-xs flex-1 sm:flex-none"
                        onClick={saveAllToGallery}
                      >
                        <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        <span className="hidden sm:inline">
                          Save All to Gallery
                        </span>
                        <span className="sm:hidden">Save All</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={generatedImages.length === 0}
                        className="text-xs flex-1 sm:flex-none"
                        onClick={() => {
                          generatedImages.forEach((url, i) =>
                            downloadImage(url, i)
                          );
                        }}
                      >
                        <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        <span className="hidden sm:inline">Download All</span>
                        <span className="sm:hidden">Download</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!textPrompt}
                        onClick={copyPrompt}
                        className="text-xs"
                      >
                        <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        <span className="hidden sm:inline">Copy Prompt</span>
                        <span className="sm:hidden">Copy</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStep("INPUT")}
                        className="text-xs"
                      >
                        <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        <span className="hidden sm:inline">New Generation</span>
                        <span className="sm:hidden">New</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Error Display - Mobile optimized */}
            {error && (
              <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                  <div className="flex items-start gap-2 text-red-600">
                    <Zap className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm">
                        Generation Error
                      </span>
                      <p className="text-xs sm:text-sm mt-1 break-words">
                        {error}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setError("")}
                    className="mt-3 text-xs"
                  >
                    Dismiss
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right rail: Settings panel - Mobile optimized with order */}
          <div className="lg:sticky lg:top-4 h-fit space-y-3 sm:space-y-4 order-2 lg:order-2">
            {/* Style Selection */}
            <Card>
              <CardHeader
                className="py-3 px-3 sm:px-6 cursor-pointer select-none"
                onClick={() => setOpenStyles((v) => !v)}
              >
                <CardTitle className="flex items-center justify-between text-sm sm:text-base">
                  <span className="flex items-center gap-2">
                    <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
                    Image Style
                  </span>
                  {openStyles ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
              {openStyles && (
                <CardContent className="px-3 sm:px-6">
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                    {imageStyles.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSelectedStyle(style.id)}
                        className={`group relative overflow-hidden rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 aspect-square text-left ${
                          selectedStyle === style.id
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                        aria-label={`Select ${style.name} style`}
                      >
                        {/* Background preview */}
                        <img
                          src={style.preview}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70 transition-opacity duration-200 group-hover:via-black/40 group-hover:to-black/80" />
                        {/* Content */}
                        <div className="relative z-10 h-full w-full p-2 flex flex-col">
                          <div className="mt-auto">
                            <div className="text-white text-xs font-medium mb-0.5 sm:mb-1">
                              {style.name}
                            </div>
                            <p className="text-white/80 text-[10px] leading-tight line-clamp-2">
                              {style.description}
                            </p>
                          </div>
                        </div>
                        {/* Selection indicator */}
                        {selectedStyle === style.id && (
                          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary rounded-full border-2 border-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Generation Settings */}
            <Card>
              <CardHeader
                className="py-3 px-3 sm:px-6 cursor-pointer select-none"
                onClick={() => setOpenSettings((v) => !v)}
              >
                <CardTitle className="flex items-center justify-between text-sm sm:text-base">
                  <span className="flex items-center gap-2">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                    Settings
                  </span>
                  {openSettings ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
              {openSettings && (
                <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
                  {/* Aspect Ratio */}
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">
                      Aspect Ratio
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-1.5 sm:gap-2">
                      {aspectRatios.map((ratio) => (
                        <button
                          key={ratio.id}
                          onClick={() => setAspectRatio(ratio.id)}
                          className={`p-2 text-xs border rounded-md transition-all ${
                            aspectRatio === ratio.id
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="font-medium">{ratio.name}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {ratio.ratio}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Number of Images */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm font-medium">
                        Number of Images
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {numberOfImages[0]}
                      </span>
                    </div>
                    <Slider
                      value={numberOfImages}
                      onValueChange={setNumberOfImages}
                      max={4}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Generate 1-4 images at once
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Advanced Settings */}
            <Card>
              <CardHeader
                className="py-3 px-3 sm:px-6 cursor-pointer select-none"
                onClick={() => setOpenAdvanced((v) => !v)}
              >
                <CardTitle className="flex items-center justify-between text-sm sm:text-base">
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                    Advanced
                  </span>
                  {openAdvanced ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
              {openAdvanced && (
                <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
                  {/* Guidance Scale */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-medium">
                        Guidance Scale
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {guidanceScale[0]}
                      </span>
                    </div>
                    <Slider
                      value={guidanceScale}
                      onValueChange={setGuidanceScale}
                      max={20}
                      min={1}
                      step={0.5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      How closely to follow the prompt (7.5 recommended)
                    </p>
                  </div>

                  {/* Steps */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-medium">
                        Inference Steps
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {steps[0]}
                      </span>
                    </div>
                    <Slider
                      value={steps}
                      onValueChange={setSteps}
                      max={50}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      More steps = higher quality but slower (20-30 recommended)
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader
                className="py-3 px-3 sm:px-6 cursor-pointer select-none"
                onClick={() => setOpenTips((v) => !v)}
              >
                <CardTitle className="flex items-center justify-between text-sm sm:text-base">
                  <span className="text-xs sm:text-sm">Pro Tips</span>
                  {openTips ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
              {openTips && (
                <CardContent className="text-xs text-muted-foreground space-y-1.5 sm:space-y-2 px-3 sm:px-6">
                  <p>• Be specific and descriptive in your prompts</p>
                  <p>
                    • Use art style keywords like "photorealistic", "oil
                    painting"
                  </p>
                  <p>• Add quality terms: "high quality", "detailed", "4K"</p>
                  <p>• Use negative prompts to avoid unwanted elements</p>
                  <p>• Try different guidance scales for varied results</p>
                </CardContent>
              )}
            </Card>
          </div>
        </div>

        {/* Floating Generate Button - Mobile only, sticky at bottom */}
        {step === "INPUT" && (
          <div className="fixed bottom-0 left-0 right-0 p-3 bg-background/95 backdrop-blur-sm border-t lg:hidden z-50">
            <div className="max-w-[1400px] mx-auto flex gap-2">
              <Button
                className="flex-1 h-12 text-sm font-semibold shadow-lg"
                onClick={handleGenerate}
                disabled={
                  isGenerating ||
                  (!textPrompt.trim() && uploadedImages.length === 0)
                }
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span className="truncate">
                      Generating {numberOfImages[0]}...
                    </span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    <span className="truncate">
                      Generate {numberOfImages[0]} Image
                      {numberOfImages[0] > 1 ? "s" : ""}
                    </span>
                  </>
                )}
              </Button>
              {(textPrompt.trim() ||
                uploadedImages.length > 0 ||
                negativePrompt.trim()) && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 flex-shrink-0"
                  onClick={resetAll}
                  disabled={isGenerating}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
