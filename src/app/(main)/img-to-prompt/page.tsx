"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/image-upload";
import { FeatureCreditCost } from "@/components/credits-badge";
import { CREDIT_COSTS } from "@/lib/credits-service";
import { useCredits } from "@/contexts/credits-context";
import { CostPreview } from "@/components/cost-preview";
import { showToast } from "@/lib/toast";
import {
  FileImage,
  MessageSquare,
  Copy,
  Download,
  Wand2,
  Sparkles,
  Eye,
  Tag,
  Palette,
  Camera,
  Loader2,
  ChevronDown,
  ChevronRight,
  Settings,
  RotateCcw,
  ArrowLeft,
  Repeat2,
} from "lucide-react";

const promptStyles = [
  {
    id: "detailed",
    name: "Detailed Description",
    description: "Comprehensive scene analysis",
  },
  {
    id: "artistic",
    name: "Artistic Style",
    description: "Focus on artistic elements",
  },
  {
    id: "commercial",
    name: "Commercial Use",
    description: "Marketing-ready descriptions",
  },
  {
    id: "technical",
    name: "Technical Details",
    description: "Camera and lighting specs",
  },
];

type Step = "UPLOAD" | "ANALYZE";

export default function ImgToPromptPage() {
  // Credits context for real-time updates
  const { updateCredits } = useCredits();

  // Flow state
  const [step, setStep] = useState<Step>("UPLOAD");
  const [uploadedImage, setUploadedImage] = useState("");
  const [lastUploadedImage, setLastUploadedImage] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("detailed");
  const [numberOfPrompts, setNumberOfPrompts] = useState([3]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState("");
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  // Prompt selection state
  const [selectedPrompts, setSelectedPrompts] = useState<Set<number>>(
    new Set()
  );
  const promptsRef = useRef<HTMLDivElement>(null);

  // UI toggles for collapsible groups
  const [openUpload, setOpenUpload] = useState(true);
  const [openPromptStyles, setOpenPromptStyles] = useState(true);
  const [openCustomSettings, setOpenCustomSettings] = useState(true);
  const [openTips, setOpenTips] = useState(false);

  const handleAfterUpload = (url: string) => {
    setUploadedImage(url);
    setLastUploadedImage(url);
    setGeneratedPrompts([]); // Clear previous prompts for new image
    setAnalysisResult(""); // Clear previous analysis
    setError(""); // Clear any errors
    setSelectedPrompts(new Set()); // Clear prompt selections
    setStep("ANALYZE");
  };

  // Navigation actions
  const goToUpload = () => {
    setUploadedImage("");
    setGeneratedPrompts([]);
    setAnalysisResult("");
    setError("");
    setSelectedPrompts(new Set());
    setStep("UPLOAD");
  };

  const restorePrevious = () => {
    if (lastUploadedImage) {
      setUploadedImage(lastUploadedImage);
      setGeneratedPrompts([]);
      setAnalysisResult("");
      setError("");
      setSelectedPrompts(new Set());
      setStep("ANALYZE");
    }
  };

  // Prompt selection handlers
  const togglePromptSelection = (index: number) => {
    setSelectedPrompts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const selectAllPrompts = () => {
    setSelectedPrompts(
      new Set(Array.from({ length: generatedPrompts.length }, (_, i) => i))
    );
  };

  const clearSelection = () => {
    setSelectedPrompts(new Set());
  };

  const handleAnalyzeImage = async () => {
    if (!uploadedImage) {
      showToast.warning("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      const response = await fetch("/api/img-to-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadedImage,
          promptStyle: selectedStyle,
          numberOfPrompts: numberOfPrompts[0],
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
        throw new Error(result.error || "Failed to generate prompts");
      }

      if (result.success && result.prompts) {
        setGeneratedPrompts(result.prompts);
        setAnalysisResult(result.keyElements || "Image analysis complete");
        setSelectedPrompts(new Set()); // Clear previous selections

        // Scroll to prompts section after a short delay to ensure rendering
        setTimeout(() => {
          promptsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      } else {
        throw new Error("No prompts received from the API");
      }
    } catch (error) {
      console.error("Prompt generation failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      showToast.error("Failed to generate prompts", errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopySuccess("Copied to clipboard!");
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch(() => {
        setCopySuccess("Failed to copy");
        setTimeout(() => setCopySuccess(""), 2000);
      });
  };

  const copySelectedPrompts = () => {
    const selectedTexts = Array.from(selectedPrompts)
      .map((index) => generatedPrompts[index])
      .join("\n\n---\n\n");
    copyToClipboard(selectedTexts);
  };

  const downloadSelectedPrompts = () => {
    if (selectedPrompts.size === 0) return;

    const selectedTexts = Array.from(selectedPrompts).map(
      (index) => generatedPrompts[index]
    );
    const content = `Image-to-Prompt Analysis Results (Selected)
Generated on: ${new Date().toLocaleString()}
Style: ${
      promptStyles.find((s) => s.id === selectedStyle)?.name || selectedStyle
    }
Number of selected prompts: ${selectedTexts.length}

Key Elements: ${analysisResult}

Selected Prompts:
${selectedTexts.map((prompt, index) => `${index + 1}. ${prompt}`).join("\n\n")}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `selected-prompts-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const useInImageGeneration = () => {
    if (selectedPrompts.size !== 1) return;

    const selectedIndex = Array.from(selectedPrompts)[0];
    const selectedPrompt = generatedPrompts[selectedIndex];

    // Navigate to prompt-to-image page with the selected prompt
    const encodedPrompt = encodeURIComponent(selectedPrompt);
    window.location.href = `/prompt-to-image?prompt=${encodedPrompt}`;
  };

  const downloadAsTextFile = () => {
    if (generatedPrompts.length === 0) return;

    const content = `Image-to-Prompt Analysis Results
Generated on: ${new Date().toLocaleString()}
Style: ${
      promptStyles.find((s) => s.id === selectedStyle)?.name || selectedStyle
    }
Number of prompts: ${generatedPrompts.length}

Key Elements: ${analysisResult}

Generated Prompts:
${generatedPrompts
  .map((prompt, index) => `${index + 1}. ${prompt}`)
  .join("\n\n")}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `image-prompts-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    setUploadedImage("");
    setGeneratedPrompts([]);
    setAnalysisResult("");
    setSelectedStyle("detailed");
    setNumberOfPrompts([3]);
    setError("");
    setCopySuccess("");
    setSelectedPrompts(new Set());
    setStep("UPLOAD");
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mx-auto max-w-[1400px]">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
              <FileImage className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Image to Prompt Generator
              <FeatureCreditCost cost={CREDIT_COSTS.TEXT_PROMPT} size="md" />
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Transform your images into detailed text prompts for AI
              generation. Perfect for creating consistent style descriptions and
              training data.
            </p>
          </div>

          {/* Step-aware actions */}
          <div className="flex gap-2">
            {step === "ANALYZE" ? (
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

        {/* Main layout: large center + sticky right rail */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
          {/* Center column */}
          <div className="space-y-4">
            {step === "UPLOAD" && (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Camera className="h-5 w-5" />
                    Upload Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ImageUpload
                    onImageUploaded={handleAfterUpload}
                    uploadedImageUrl={uploadedImage}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload any image to generate detailed text prompts
                    describing its content
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
                      >
                        Restore last uploaded
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {step === "ANALYZE" && uploadedImage && (
              <>
                {/* Image Preview Card */}
                <Card className="overflow-hidden">
                  <div className="flex items-center justify-between px-4 pt-4">
                    <h3 className="text-base font-medium">Source Image</h3>
                    <Button
                      size="sm"
                      onClick={handleAnalyzeImage}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating {numberOfPrompts[0]} prompt
                          {numberOfPrompts[0] > 1 ? "s" : ""}...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate {numberOfPrompts[0]} Prompt
                          {numberOfPrompts[0] > 1 ? "s" : ""}{" "}
                          <span className="opacity-90">
                            (
                            <CostPreview
                              baseRate={CREDIT_COSTS.TEXT_PROMPT}
                              quantity={numberOfPrompts[0]}
                            />
                            )
                          </span>
                        </>
                      )}
                    </Button>
                  </div>

                  <CardContent className="pt-4">
                    <div className="rounded-lg border bg-background">
                      <img
                        src={uploadedImage}
                        alt="Source"
                        className="w-full h-[400px] md:h-[500px] object-contain"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions: condensed bar */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">
                      {selectedPrompts.size > 0
                        ? "Selected Actions"
                        : "Quick Actions"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {selectedPrompts.size > 0 ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copySelectedPrompts}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Selected ({selectedPrompts.size})
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadSelectedPrompts}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export Selected
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={useInImageGeneration}
                            disabled={selectedPrompts.size !== 1}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Use in Image Generation
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={generatedPrompts.length === 0}
                            onClick={downloadAsTextFile}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={generatedPrompts.length === 0}
                            onClick={() => {
                              const allPrompts =
                                generatedPrompts.join("\n\n---\n\n");
                              copyToClipboard(allPrompts);
                            }}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy All
                          </Button>
                        </>
                      )}
                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStep("UPLOAD")}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        New Image
                      </Button> */}
                    </div>
                    {selectedPrompts.size > 1 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        "Use in Image Generation" requires exactly one prompt to
                        be selected
                      </p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Copy Success Display */}
            {copySuccess && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-green-600">
                    <Copy className="h-4 w-4" />
                    <span className="font-medium">{copySuccess}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-600">
                    <Tag className="h-4 w-4" />
                    <span className="font-medium">Error</span>
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

            {/* Generated Prompts */}
            {generatedPrompts.length > 0 && (
              <Card ref={promptsRef}>
                <CardHeader className="py-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Generated Prompts
                      {selectedPrompts.size > 0 && (
                        <Badge variant="secondary">
                          {selectedPrompts.size} selected
                        </Badge>
                      )}
                    </span>
                    <div className="flex gap-2">
                      {selectedPrompts.size > 0 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearSelection}
                        >
                          Clear Selection
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={selectAllPrompts}
                        >
                          Select All
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const allPrompts =
                            generatedPrompts.join("\n\n---\n\n");
                          copyToClipboard(allPrompts);
                        }}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy All
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedPrompts.map((prompt, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedPrompts.has(index)}
                            onCheckedChange={() => togglePromptSelection(index)}
                            className="mt-1 border border-solid border-primary"
                          />
                          <Badge variant="outline">Variation {index + 1}</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(prompt)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <Textarea
                        value={prompt}
                        readOnly
                        className={`min-h-[100px] resize-none transition-all ${
                          selectedPrompts.has(index)
                            ? "ring-2 ring-primary/50 border-primary/50"
                            : ""
                        }`}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right rail: sticky, narrower, grouped */}
          <div className="xl:sticky xl:top-4 h-fit space-y-4">
            {/* Prompt Style Selection */}
            <Card>
              <CardHeader
                className="py-3 cursor-pointer select-none"
                onClick={() => setOpenPromptStyles((v) => !v)}
              >
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Prompt Styles
                  </span>
                  {openPromptStyles ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
              {openPromptStyles && (
                <CardContent>
                  <div className="space-y-2">
                    {promptStyles.map((style) => (
                      <div
                        key={style.id}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedStyle === style.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedStyle(style.id)}
                      >
                        <div className="font-medium text-sm mb-1">
                          {style.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {style.description}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Number of Prompts Slider */}
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Number of Prompts
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {numberOfPrompts[0]}
                      </span>
                    </div>
                    <Slider
                      value={numberOfPrompts}
                      onValueChange={setNumberOfPrompts}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Generate 1-5 different prompt variations
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Analysis Results */}
            {analysisResult && (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Tag className="h-5 w-5" />
                    Key Elements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge
                      variant="secondary"
                      className="w-full justify-center"
                    >
                      Analysis Complete
                    </Badge>
                    <p className="text-sm">{analysisResult}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader
                className="py-3 cursor-pointer select-none"
                onClick={() => setOpenCustomSettings((v) => !v)}
              >
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {selectedPrompts.size > 0 ? "Selected Actions" : "Actions"}
                  </span>
                  {openCustomSettings ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
              {openCustomSettings && (
                <CardContent className="space-y-3">
                  {selectedPrompts.size > 0 ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={copySelectedPrompts}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Selected Prompts ({selectedPrompts.size})
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={downloadSelectedPrompts}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Selected as Text File
                      </Button>
                      <Button
                        variant={
                          selectedPrompts.size === 1 ? "default" : "outline"
                        }
                        className="w-full justify-start"
                        disabled={selectedPrompts.size !== 1}
                        onClick={useInImageGeneration}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Use in Image Generation
                      </Button>
                      {selectedPrompts.size > 1 && (
                        <p className="text-xs text-muted-foreground px-1">
                          Select exactly one prompt to use in image generation
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        disabled={generatedPrompts.length === 0}
                        onClick={() => {
                          const allPrompts =
                            generatedPrompts.join("\n\n---\n\n");
                          copyToClipboard(allPrompts);
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy All Prompts
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        disabled={generatedPrompts.length === 0}
                        onClick={downloadAsTextFile}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export as Text File
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        disabled={generatedPrompts.length === 0}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Select a prompt first
                      </Button>
                    </>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Features */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-primary" />
                    <span>AI-powered analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span>Multiple prompt variations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-primary" />
                    <span>Style-specific descriptions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <span>Element identification</span>
                  </div>
                </div>
              </CardContent>
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
                  <p>• High-quality images produce better prompts</p>
                  <p>• Use "Technical Details" for precise descriptions</p>
                  <p>• "Commercial Use" is great for product descriptions</p>
                  <p>• Edit generated prompts to fit your needs</p>
                  <p>• Try different styles for varied prompt approaches</p>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
