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
      console.log("Sending request to API...");
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
      console.log("API response:", result);

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

  const resetAll = () => {
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
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mx-auto max-w-[1400px]">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
              <Wand2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Prompt to Image Generator
              <FeatureCreditCost cost={CREDIT_COSTS.TEXT_PROMPT} size="md" />
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Generate stunning images from text prompts or transform existing
              images with AI. Create artwork, photos, and designs with advanced
              AI models.
            </p>
          </div>

          {/* Step-aware actions */}
          <div className="flex gap-2">
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

        {/* Main layout: large center + sticky right rail */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
          {/* Center column */}
          <div className="space-y-4">
            {step === "INPUT" && (
              <>
                {/* Text Prompt Input - Updated to include multi-image upload */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="h-5 w-5" />
                      Text & Image Input
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Describe what you want to generate
                      </label>
                      <Textarea
                        placeholder="A beautiful sunset over mountains, photorealistic, high quality, detailed landscape..."
                        value={textPrompt}
                        onChange={(e) => setTextPrompt(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </div>

                    {/* Multi-Image Upload */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
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
                      <label className="text-sm font-medium">
                        Negative Prompt (Optional)
                      </label>
                      <Textarea
                        placeholder="What you don't want in the image: blurry, low quality, distorted..."
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        rows={2}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        Describe what you want to avoid in the generated image
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Generate Button */}
                <Card>
                  <CardContent className="pt-6 space-y-3">
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
                          Generating {numberOfImages[0]} image
                          {numberOfImages[0] > 1 ? "s" : ""}...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-5 w-5 mr-2" />
                          Generate {numberOfImages[0]} Image
                          {numberOfImages[0] > 1 ? "s" : ""}{" "}
                          <span className="opacity-90">
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
                {/* Input Preview Card */}
                <Card className="overflow-hidden">
                  <div className="flex items-center justify-between px-4 pt-4">
                    <h3 className="text-base font-medium">Input Used</h3>
                    <Button
                      size="sm"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Regenerate
                        </>
                      )}
                    </Button>
                  </div>

                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {textPrompt && (
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm leading-relaxed">
                            {textPrompt}
                          </p>
                          {negativePrompt && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs text-muted-foreground">
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
                                className="w-20 h-20 rounded-lg overflow-hidden border bg-background"
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

                {/* Generated Images */}
                {generatedImages.length > 0 && (
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="flex items-center justify-between text-base">
                        <span className="flex items-center gap-2">
                          <ImageIcon className="h-5 w-5" />
                          Generated Images ({generatedImages.length})
                        </span>
                        <Badge variant="secondary">
                          {selectedStyle.charAt(0).toUpperCase() +
                            selectedStyle.slice(1)}{" "}
                          Style
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {generatedImages.map((imageUrl, index) => (
                          <div key={index} className="space-y-2">
                            <div className="relative group rounded-lg overflow-hidden border">
                              <img
                                src={imageUrl}
                                alt={`Generated ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">Image {index + 1}</Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadImage(imageUrl, index)}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={generatedImages.length === 0}
                        onClick={() => {
                          generatedImages.forEach((url, i) =>
                            downloadImage(url, i)
                          );
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!textPrompt}
                        onClick={copyPrompt}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Prompt
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStep("INPUT")}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        New Generation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-600">
                    <Zap className="h-4 w-4" />
                    <span className="font-medium">Generation Error</span>
                  </div>
                  <p className="text-sm text-red-600 mt-2">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setError("")}
                    className="mt-3"
                  >
                    Dismiss
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right rail: sticky, narrower, grouped */}
          <div className="xl:sticky xl:top-4 h-fit space-y-4">
            {/* Style Selection */}
            <Card>
              <CardHeader
                className="py-3 cursor-pointer select-none"
                onClick={() => setOpenStyles((v) => !v)}
              >
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
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
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
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
                            <div className="text-white text-xs font-medium mb-1">
                              {style.name}
                            </div>
                            <p className="text-white/80 text-[10px] leading-tight">
                              {style.description}
                            </p>
                          </div>
                        </div>
                        {/* Selection indicator */}
                        {selectedStyle === style.id && (
                          <div className="absolute top-2 right-2">
                            <div className="w-3 h-3 bg-primary rounded-full border-2 border-white" />
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
                className="py-3 cursor-pointer select-none"
                onClick={() => setOpenSettings((v) => !v)}
              >
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
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
                <CardContent className="space-y-4">
                  {/* Aspect Ratio */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Aspect Ratio</label>
                    <div className="grid grid-cols-2 gap-2">
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
                          {ratio.name}
                          <div className="text-[10px] text-muted-foreground mt-1">
                            {ratio.ratio}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Number of Images */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">
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
                className="py-3 cursor-pointer select-none"
                onClick={() => setOpenAdvanced((v) => !v)}
              >
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
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
                <CardContent className="space-y-4">
                  {/* Guidance Scale */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
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
                      <span className="text-sm font-medium">
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
                className="py-3 cursor-pointer select-none"
                onClick={() => setOpenTips((v) => !v)}
              >
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="text-sm">Pro Tips</span>
                  {openTips ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
              {openTips && (
                <CardContent className="text-xs text-muted-foreground space-y-2">
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
      </div>
    </div>
  );
}
