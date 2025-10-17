"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/image-upload";
import { FeatureCreditCost } from "@/components/credits-badge";
import { CREDIT_COSTS } from "@/lib/credits-service";
import { useCredits } from "@/contexts/credits-context";
import { CostPreview } from "@/components/cost-preview";
import { showToast } from "@/lib/toast";
import {
  Camera,
  Palette,
  Sun,
  Contrast,
  Droplets,
  Zap,
  Download,
  RotateCcw,
  Eye,
  Settings,
  Image as ImageIcon,
  Sparkles,
  Filter,
  ArrowLeft,
  ArrowRight,
  Repeat2,
  ChevronDown,
  ChevronRight,
  Edit3,
} from "lucide-react";

type Step = "UPLOAD" | "EDIT";

export default function PhotographyPage() {
  // Credits context for real-time updates
  const { updateCredits } = useCredits();

  // Flow state
  const [step, setStep] = useState<Step>("UPLOAD");
  // Current image in editor
  const [uploadedImage, setUploadedImage] = useState("");
  const [processedImage, setProcessedImage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<
    "enhance" | "preset" | "custom" | null
  >(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Keep last uploaded image to restore quickly
  const [lastUploadedImage, setLastUploadedImage] = useState("");

  // Image history management
  const [imageHistory, setImageHistory] = useState<string[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  // Photo editing controls
  const [brightness, setBrightness] = useState([0]);
  const [contrast, setContrast] = useState([0]);
  const [saturation, setSaturation] = useState([0]);
  const [sharpness, setSharpness] = useState([0]);
  const [exposure, setExposure] = useState([0]);

  // Manual adjustments state
  const [hasManualAdjustments, setHasManualAdjustments] = useState(false);
  const [isApplyingManual, setIsApplyingManual] = useState(false);

  // UI toggles for collapsible groups
  const [openPresets, setOpenPresets] = useState(true);
  const [openCustomEnhance, setOpenCustomEnhance] = useState(true);
  const [openManual, setOpenManual] = useState(true);
  const [openTips, setOpenTips] = useState(false);

  // Custom enhancement
  const [customEnhancePrompt, setCustomEnhancePrompt] = useState("");

  // Image type selection for API calls
  const [useEnhancedImage, setUseEnhancedImage] = useState(true);

  // Helper function to create CSS filter string from slider values
  const getCSSFilters = () => {
    const filters = [];

    // Convert slider values to CSS filter values
    if (brightness[0] !== 0) {
      const brightnessValue = 1 + brightness[0] / 100; // -100 to 100 -> 0 to 2
      filters.push(`brightness(${brightnessValue})`);
    }

    if (contrast[0] !== 0) {
      const contrastValue = 1 + contrast[0] / 100; // -100 to 100 -> 0 to 2
      filters.push(`contrast(${contrastValue})`);
    }

    if (saturation[0] !== 0) {
      const saturationValue = 1 + saturation[0] / 100; // -100 to 100 -> 0 to 2
      filters.push(`saturate(${saturationValue})`);
    }

    if (exposure[0] !== 0) {
      // Exposure affects brightness in a different way
      const exposureValue = 1 + exposure[0] / 200; // -100 to 100 -> 0.5 to 1.5
      filters.push(`brightness(${exposureValue})`);
    }

    // Note: CSS doesn't have a sharpness filter, but we can simulate with contrast
    if (sharpness[0] !== 0) {
      const sharpnessValue = 1 + sharpness[0] / 200; // Subtle effect
      filters.push(`contrast(${sharpnessValue})`);
    }

    return filters.join(" ");
  };

  // Check if any manual adjustments are active
  const checkManualAdjustments = () => {
    const hasAdjustments =
      brightness[0] !== 0 ||
      contrast[0] !== 0 ||
      saturation[0] !== 0 ||
      sharpness[0] !== 0 ||
      exposure[0] !== 0;

    setHasManualAdjustments(hasAdjustments);
    return hasAdjustments;
  };

  // Apply manual adjustments by capturing the filtered image
  const applyManualAdjustments = async () => {
    if (!uploadedImage) return;

    const hasAdjustments = checkManualAdjustments();
    if (!hasAdjustments) return;

    setIsApplyingManual(true);

    try {
      // Get the base image (either original or last processed)
      const baseImage = processedImage || uploadedImage;

      // Create a canvas to apply filters and generate new image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      const img = new Image();

      img.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;

          // Apply filters to context
          ctx.filter = getCSSFilters();
          ctx.drawImage(img, 0, 0);

          // Convert canvas to blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                addToHistory(url);
                resolve(url);
              } else {
                reject(new Error("Failed to create blob from canvas"));
              }
            },
            "image/jpeg",
            0.9
          );
        };

        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = baseImage;
      });
    } catch (error) {
      console.error("Failed to apply manual adjustments:", error);
      showToast.error(
        "Failed to apply manual adjustments",
        "Please try again."
      );
    } finally {
      setIsApplyingManual(false);
    }
  };

  // Updated presets with preview images
  const presets = useMemo(
    () => [
      {
        name: "Studio Portrait",
        icon: Camera,
        description: "Crisp light, soft skin",
        image:
          "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=640&q=80&auto=format&fit=crop",
      },
      {
        name: "Natural Light",
        icon: Sun,
        description: "Soft daylight tones",
        image:
          "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=640&q=80&auto=format&fit=crop",
      },
      {
        name: "High Fashion",
        icon: Sparkles,
        description: "Bold contrast look",
        image:
          "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=640&q=80&auto=format&fit=crop",
      },
      {
        name: "Vintage Film",
        icon: Filter,
        description: "Grain & warm fade",
        image:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=640&q=80&auto=format&fit=crop",
      },
      {
        name: "Clean & Bright",
        icon: Eye,
        description: "Fresh commercial",
        image:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=640&q=80&auto=format&fit=crop",
      },
      {
        name: "Moody & Dark",
        icon: Contrast,
        description: "Deep shadows vibe",
        image:
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=640&q=80&auto=format&fit=crop",
      },
    ],
    []
  ); // Background previews per Tailwind background utilities. [web:67]

  // Check manual adjustments on mount and when slider values change
  useEffect(() => {
    checkManualAdjustments();
  }, [brightness, contrast, saturation, sharpness, exposure]);

  const handleAfterUpload = (url: string) => {
    setUploadedImage(url);
    setLastUploadedImage(url);
    setProcessedImage("");
    setImageHistory([]); // Clear history for new image
    setCurrentHistoryIndex(-1);
    setCustomEnhancePrompt(""); // Clear custom prompt for new image
    setStep("EDIT");
  }; // Progressive flow without reload. [web:67]

  // Helper function to add new image to history
  const addToHistory = (newImage: string) => {
    const newHistory = [...imageHistory];

    // If we're not at the end of history, remove everything after current position
    if (currentHistoryIndex < imageHistory.length - 1) {
      newHistory.splice(currentHistoryIndex + 1);
    }

    // Add new image to history
    newHistory.push(newImage);
    setImageHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
    setProcessedImage(newImage);
  };

  // Navigation functions
  const goBackInHistory = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      setProcessedImage(imageHistory[newIndex]);
    }
  };

  const goForwardInHistory = () => {
    if (currentHistoryIndex < imageHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      setProcessedImage(imageHistory[newIndex]);
    }
  };

  const resetToOriginal = () => {
    setProcessedImage("");
    setImageHistory([]);
    setCurrentHistoryIndex(-1);
    resetControls();
  };

  const handleEnhance = async () => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    setProcessingType("enhance");
    setActivePreset(null);

    try {
      // Determine which image to use based on selection
      const imageToUse =
        useEnhancedImage && processedImage ? processedImage : uploadedImage;

      const response = await fetch("/api/photography-enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: imageToUse,
          enhancementType: "overall",
          intensity: "medium",
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
        throw new Error(result.error || "Failed to enhance image");
      }

      if (result.success && result.enhancedImage) {
        addToHistory(result.enhancedImage);
      } else {
        throw new Error("No enhanced image received");
      }
    } catch (error) {
      console.error("Enhancement failed:", error);
      showToast.error(
        "Failed to enhance image",
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
  }; // Real AI enhancement via API. [web:67]

  const handlePresetApply = async (presetName: string) => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    setProcessingType("preset");
    setActivePreset(presetName);

    try {
      // Determine which image to use based on selection
      const imageToUse =
        useEnhancedImage && processedImage ? processedImage : uploadedImage;

      const response = await fetch("/api/photography-presets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: imageToUse,
          presetName: presetName,
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
        throw new Error(result.error || "Failed to apply preset");
      }

      if (result.success && result.styledImage) {
        addToHistory(result.styledImage);
      } else {
        throw new Error("No styled image received");
      }
    } catch (error) {
      console.error("Preset application failed:", error);
      showToast.error(
        "Failed to apply preset",
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
      setActivePreset(null);
    }
  }; // Apply preset via API. [web:67]

  const handleCustomEnhance = async () => {
    if (!uploadedImage || !customEnhancePrompt.trim()) return;
    setIsProcessing(true);
    setProcessingType("custom");
    setActivePreset(null);

    try {
      // Determine which image to use based on selection
      const imageToUse =
        useEnhancedImage && processedImage ? processedImage : uploadedImage;

      const response = await fetch("/api/photography-enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: imageToUse,
          enhancementType: "custom",
          customPrompt: customEnhancePrompt.trim(),
          intensity: "medium",
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
        throw new Error(result.error || "Failed to apply custom enhancement");
      }

      if (result.success && result.enhancedImage) {
        addToHistory(result.enhancedImage);
      } else {
        throw new Error("No enhanced image received");
      }
    } catch (error) {
      console.error("Custom enhancement failed:", error);
      showToast.error(
        "Failed to apply custom enhancement",
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
  }; // Apply custom enhancement via API.

  const resetControls = () => {
    setBrightness([0]);
    setContrast([0]);
    setSaturation([0]);
    setSharpness([0]);
    setExposure([0]);
    setHasManualAdjustments(false);
    setCustomEnhancePrompt(""); // Clear custom prompt when resetting
    setUseEnhancedImage(true); // Reset to default enhanced image selection
  }; // Slider reset helper. [web:67]

  // Navigation actions
  const goToUpload = () => {
    setUploadedImage("");
    setProcessedImage("");
    setStep("UPLOAD");
  }; // Back to upload while caching previous. [web:67]

  const restorePrevious = () => {
    if (lastUploadedImage) {
      setUploadedImage(lastUploadedImage);
      setProcessedImage("");
      setImageHistory([]);
      setCurrentHistoryIndex(-1);
      setStep("EDIT");
    }
  }; // Restore instantly. [web:67]

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="mx-auto max-w-[1400px]">
        {/* Top bar - Mobile optimized */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold flex flex-wrap items-center gap-1.5 sm:gap-2">
                <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <span className="truncate">Photography Studio</span>
                <FeatureCreditCost
                  cost={CREDIT_COSTS.PHOTO_ENHANCEMENT}
                  size="md"
                />
              </h1>
            </div>

            {/* Step-aware actions - Hidden on mobile, shown on tablet+ */}
            <div className="hidden sm:flex gap-2 flex-shrink-0">
              {step === "EDIT" ? (
                <Button variant="outline" size="sm" onClick={goToUpload}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Change photo
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={restorePrevious}
                  disabled={!lastUploadedImage}
                >
                  <Repeat2 className="h-4 w-4 mr-2" />
                  Use previous
                </Button>
              )}
            </div>
          </div>

          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
            Upload photos and transform them with AI-powered enhancements,
            professional style presets, and fine-tuned adjustments.
          </p>

          {/* Mobile-only action buttons */}
          <div className="flex sm:hidden gap-2 mt-3">
            {step === "EDIT" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={goToUpload}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Change photo
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={restorePrevious}
                disabled={!lastUploadedImage}
                className="flex-1"
              >
                <Repeat2 className="h-4 w-4 mr-2" />
                Use previous
              </Button>
            )}
          </div>
        </div>

        {/* Main layout: Responsive stacking */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3 sm:gap-4">
          {/* Center column */}
          <div className="space-y-3 sm:space-y-4 order-1 lg:order-1 pb-24 lg:pb-0">
            {step === "UPLOAD" && (
              <Card>
                <CardHeader className="py-3 px-3 sm:px-6">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    Upload Photo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-3 sm:px-6">
                  <ImageUpload
                    onImageUploaded={handleAfterUpload}
                    uploadedImageUrl={uploadedImage}
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: Any photo works! Our AI will enhance lighting, colors,
                    and overall quality automatically.
                  </p>
                  {lastUploadedImage && (
                    <div className="flex items-center gap-2">
                      <img
                        src={lastUploadedImage}
                        alt="Last upload"
                        className="h-12 w-12 rounded object-cover border"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={restorePrevious}
                        className="text-xs"
                      >
                        Restore last uploaded
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {step === "EDIT" && uploadedImage && (
              <>
                {/* Preview card - Mobile optimized */}
                <Card className="overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 pt-3 sm:pt-4 gap-2">
                    <h3 className="text-sm sm:text-base font-medium">
                      Preview
                    </h3>
                    <div className="flex gap-1.5 sm:gap-2">
                      {/* Desktop controls */}
                      <div className="hidden lg:flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={goBackInHistory}
                          disabled={currentHistoryIndex <= 0}
                          title="Previous version"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={resetToOriginal}
                          title="Reset to original"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={goForwardInHistory}
                          disabled={
                            currentHistoryIndex >= imageHistory.length - 1
                          }
                          title="Next version"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleEnhance}
                          disabled={isProcessing}
                        >
                          {isProcessing && processingType === "enhance" ? (
                            <>
                              <Zap className="h-4 w-4 mr-2 animate-spin" />
                              Enhancing...
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-2" />
                              AI Enhance{" "}
                              <span className="opacity-90">
                                (
                                <CostPreview
                                  baseRate={CREDIT_COSTS.PHOTO_ENHANCEMENT}
                                  quantity={1}
                                />
                                )
                              </span>
                            </>
                          )}
                        </Button>
                      </div>
                      {/* Mobile compact controls */}
                      <div className="flex lg:hidden gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={goBackInHistory}
                          disabled={currentHistoryIndex <= 0}
                          className="h-8 w-8 p-0"
                          title="Previous"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={resetToOriginal}
                          className="h-8 w-8 p-0"
                          title="Reset"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={goForwardInHistory}
                          disabled={
                            currentHistoryIndex >= imageHistory.length - 1
                          }
                          className="h-8 w-8 p-0"
                          title="Next"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardContent className="pt-3 sm:pt-4 px-3 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Badge
                          variant="secondary"
                          className="w-full justify-center rounded-full text-xs"
                        >
                          Original
                        </Badge>
                        <div className="rounded-lg border bg-background">
                          <img
                            src={uploadedImage}
                            alt="Original"
                            className="w-full h-[280px] sm:h-[440px] md:h-[520px] object-contain"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Badge
                            variant="default"
                            className="rounded-full text-xs"
                          >
                            {isProcessing ? "Processing..." : "Enhanced"}
                          </Badge>
                          {imageHistory.length > 0 && (
                            <Badge
                              variant="outline"
                              className="text-xs rounded-full"
                            >
                              {currentHistoryIndex + 1} / {imageHistory.length}
                            </Badge>
                          )}
                        </div>
                        <div className="rounded-lg border bg-background">
                          {isProcessing ? (
                            <div className="w-full h-[280px] sm:h-[440px] md:h-[520px] grid place-items-center text-xs sm:text-sm text-muted-foreground">
                              <div className="text-center space-y-3 px-4">
                                <Zap className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto text-primary" />
                                <div className="max-w-[200px]">
                                  {processingType === "enhance"
                                    ? "Enhancing image with AI..."
                                    : processingType === "preset" &&
                                      activePreset
                                    ? `Applying ${activePreset} style...`
                                    : processingType === "custom"
                                    ? "Applying custom enhancement..."
                                    : "Processing image..."}
                                </div>
                              </div>
                            </div>
                          ) : processedImage ? (
                            /* eslint-disable-next-line react/forbid-dom-props */
                            <div
                              className="w-full h-[280px] sm:h-[440px] md:h-[520px] relative"
                              style={
                                hasManualAdjustments
                                  ? { filter: getCSSFilters() }
                                  : undefined
                              }
                            >
                              <img
                                src={processedImage}
                                alt="Enhanced"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : uploadedImage && hasManualAdjustments ? (
                            /* eslint-disable-next-line react/forbid-dom-props */
                            <div
                              className="w-full h-[280px] sm:h-[440px] md:h-[520px] relative"
                              style={{ filter: getCSSFilters() }}
                            >
                              <img
                                src={uploadedImage}
                                alt="Enhanced"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-[280px] sm:h-[440px] md:h-[520px] grid place-items-center text-xs sm:text-sm text-muted-foreground px-4 text-center">
                              Enhanced preview will appear here
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions - Mobile optimized */}
                <Card>
                  <CardHeader className="py-3 px-3 sm:px-6">
                    <CardTitle className="text-sm sm:text-base">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3 sm:pb-4 px-3 sm:px-6">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!processedImage}
                        className="text-xs flex-1 sm:flex-none"
                      >
                        <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Download</span>
                        <span className="sm:hidden">Save</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!processedImage}
                        className="text-xs flex-1 sm:flex-none"
                      >
                        <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">
                          Save to Gallery
                        </span>
                        <span className="sm:hidden">Gallery</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!processedImage}
                        className="text-xs w-full sm:w-auto"
                      >
                        <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Generate Variations
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Right rail: Settings panel - Mobile optimized */}
          <div className="lg:sticky lg:top-4 h-fit space-y-3 sm:space-y-4 order-2 lg:order-2">
            {/* Presets */}
            <Card>
              <CardHeader
                className="py-3 px-3 sm:px-6 cursor-pointer select-none"
                onClick={() => setOpenPresets((v) => !v)}
              >
                <CardTitle className="flex items-center justify-between text-sm sm:text-base">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                    Style Presets
                  </span>
                  {openPresets ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
              {openPresets && (
                <CardContent className="px-3 sm:px-6">
                  <div className="grid grid-cols-2 gap-2">
                    {presets.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handlePresetApply(preset.name)}
                        disabled={
                          step !== "EDIT" || !uploadedImage || isProcessing
                        }
                        className={[
                          "group relative overflow-hidden rounded-md border",
                          "focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          "aspect-[4/3] text-left",
                          isProcessing && activePreset === preset.name
                            ? "ring-2 ring-primary"
                            : "",
                        ].join(" ")}
                        aria-label={`Apply ${preset.name} preset`}
                      >
                        {/* Background preview */}
                        <img
                          src={preset.image}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60 transition-opacity duration-200 group-hover:via-black/40 group-hover:to-black/70" />
                        {/* Content */}
                        <div className="relative z-10 h-full w-full p-2 flex flex-col">
                          <div className="flex items-center gap-1.5 text-white/90">
                            {isProcessing && activePreset === preset.name ? (
                              <Zap className="h-3.5 w-3.5 drop-shadow animate-spin flex-shrink-0" />
                            ) : (
                              <preset.icon className="h-3.5 w-3.5 drop-shadow flex-shrink-0" />
                            )}
                            <span className="text-[11px] font-medium truncate">
                              {isProcessing && activePreset === preset.name
                                ? "Applying..."
                                : preset.name}
                            </span>
                          </div>
                          <div className="mt-auto">
                            <p className="text-[10px] text-white/80 leading-tight line-clamp-2">
                              {preset.description}
                            </p>
                          </div>
                        </div>
                        {/* Hover ring */}
                        <div className="absolute inset-0 ring-0 ring-primary/30 group-hover:ring-2 transition-all pointer-events-none rounded-md" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Custom Enhancement */}
            <Card>
              <CardHeader
                className="py-3 px-3 sm:px-6 cursor-pointer select-none"
                onClick={() => setOpenCustomEnhance((v) => !v)}
              >
                <CardTitle className="flex items-center justify-between text-sm sm:text-base">
                  <span className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4 sm:h-5 sm:w-5" />
                    Custom Enhancement
                  </span>
                  {openCustomEnhance ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
              {openCustomEnhance && (
                <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
                  <div className="space-y-3">
                    <label
                      htmlFor="custom-prompt"
                      className="text-xs sm:text-sm font-medium"
                    >
                      Describe your enhancement
                    </label>
                    <Textarea
                      id="custom-prompt"
                      placeholder="Examples:&#10;• Make the dynamic range better&#10;• Enhance the sunset colors and make them more vibrant&#10;• Improve skin tones and make them more natural&#10;• Add more dramatic lighting and shadows&#10;• Brighten the background while keeping the subject natural&#10;• Make the colors more cinematic and moody"
                      value={customEnhancePrompt}
                      onChange={(e) => setCustomEnhancePrompt(e.target.value)}
                      rows={4}
                      className="resize-none text-xs sm:text-sm"
                      disabled={step !== "EDIT" || !uploadedImage}
                    />

                    {/* Image Selection Checkboxes */}
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium">
                        Source Image Selection
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="use-enhanced"
                            checked={useEnhancedImage}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setUseEnhancedImage(true);
                              }
                            }}
                            disabled={step !== "EDIT" || !uploadedImage}
                          />
                          <label
                            htmlFor="use-enhanced"
                            className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Use enhanced image{" "}
                            {processedImage ? "(available)" : "(not available)"}
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="use-original"
                            checked={!useEnhancedImage}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setUseEnhancedImage(false);
                              }
                            }}
                            disabled={step !== "EDIT" || !uploadedImage}
                          />
                          <label
                            htmlFor="use-original"
                            className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Use original image
                          </label>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      💡 <strong>Pro tip:</strong> Be specific about what you
                      want to enhance. The AI works best with clear, descriptive
                      instructions like "improve the lighting on the subject's
                      face" rather than just "make it better".
                    </p>
                  </div>

                  <Button
                    onClick={handleCustomEnhance}
                    disabled={
                      step !== "EDIT" ||
                      !uploadedImage ||
                      !customEnhancePrompt.trim() ||
                      isProcessing
                    }
                    className="w-full text-xs sm:text-sm"
                    size="sm"
                  >
                    {isProcessing && processingType === "custom" ? (
                      <>
                        <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 animate-spin" />
                        <span className="truncate">Applying...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                        <span className="hidden sm:inline">
                          Apply Custom Enhancement
                        </span>
                        <span className="sm:hidden">Apply Custom</span>
                        <span className="opacity-90 ml-1 hidden lg:inline">
                          (
                          <CostPreview
                            baseRate={CREDIT_COSTS.PHOTO_ENHANCEMENT}
                            quantity={1}
                          />
                          )
                        </span>
                      </>
                    )}
                  </Button>
                </CardContent>
              )}
            </Card>

            {/* Manual controls */}
            <Card>
              <CardHeader
                className="py-3 px-3 sm:px-6 cursor-pointer select-none"
                onClick={() => setOpenManual((v) => !v)}
              >
                <CardTitle className="flex items-center justify-between text-sm sm:text-base">
                  <span className="flex items-center gap-2">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                    Manual Adjustments
                  </span>
                  {openManual ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
              {openManual && (
                <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">
                        Brightness
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {brightness[0]}
                      </span>
                    </div>
                    <Slider
                      value={brightness}
                      onValueChange={(value) => {
                        setBrightness(value);
                        setTimeout(checkManualAdjustments, 0);
                      }}
                      max={100}
                      min={-100}
                      step={1}
                      className="w-full"
                      disabled={step !== "EDIT"}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Contrast className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">
                        Contrast
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {contrast[0]}
                      </span>
                    </div>
                    <Slider
                      value={contrast}
                      onValueChange={(value) => {
                        setContrast(value);
                        setTimeout(checkManualAdjustments, 0);
                      }}
                      max={100}
                      min={-100}
                      step={1}
                      className="w-full"
                      disabled={step !== "EDIT"}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Palette className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">
                        Saturation
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {saturation[0]}
                      </span>
                    </div>
                    <Slider
                      value={saturation}
                      onValueChange={(value) => {
                        setSaturation(value);
                        setTimeout(checkManualAdjustments, 0);
                      }}
                      max={100}
                      min={-100}
                      step={1}
                      className="w-full"
                      disabled={step !== "EDIT"}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">
                        Sharpness
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {sharpness[0]}
                      </span>
                    </div>
                    <Slider
                      value={sharpness}
                      onValueChange={(value) => {
                        setSharpness(value);
                        setTimeout(checkManualAdjustments, 0);
                      }}
                      max={100}
                      min={-100}
                      step={1}
                      className="w-full"
                      disabled={step !== "EDIT"}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">
                        Exposure
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {exposure[0]}
                      </span>
                    </div>
                    <Slider
                      value={exposure}
                      onValueChange={(value) => {
                        setExposure(value);
                        setTimeout(checkManualAdjustments, 0);
                      }}
                      max={100}
                      min={-100}
                      step={1}
                      className="w-full"
                      disabled={step !== "EDIT"}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetControls}
                      className="flex-1 text-xs"
                      disabled={step !== "EDIT"}
                    >
                      <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Reset Sliders</span>
                      <span className="sm:hidden">Reset</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={applyManualAdjustments}
                      disabled={
                        step !== "EDIT" ||
                        !uploadedImage ||
                        isApplyingManual ||
                        !hasManualAdjustments
                      }
                      className="flex-1 text-xs"
                    >
                      {isApplyingManual ? (
                        <>
                          <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                          <span className="hidden sm:inline">Applying...</span>
                          <span className="sm:hidden">...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Apply Manual</span>
                          <span className="sm:hidden">Apply</span>
                        </>
                      )}
                    </Button>
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
                  <p>
                    • Start with presets, then fine-tune with sliders for speed
                    and control.
                  </p>
                  <p>• Adjust exposure first to anchor the tonal balance.</p>
                  <p>• Keep saturation subtle for natural skin tones.</p>
                </CardContent>
              )}
            </Card>
          </div>
        </div>

        {/* Floating AI Enhance Button - Mobile only, sticky at bottom */}
        {step === "EDIT" && uploadedImage && (
          <div className="fixed bottom-0 left-0 right-0 p-3 bg-background/95 backdrop-blur-sm border-t lg:hidden z-50">
            <div className="max-w-[1400px] mx-auto">
              <Button
                className="w-full h-12 text-sm font-semibold shadow-lg"
                onClick={handleEnhance}
                disabled={isProcessing}
              >
                {isProcessing && processingType === "enhance" ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    <span className="truncate">Enhancing with AI...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    <span className="truncate">Apply AI Enhance</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
