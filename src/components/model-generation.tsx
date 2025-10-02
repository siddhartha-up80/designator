"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, User, Users } from "lucide-react";
import { showToast } from "@/lib/toast";

interface ModelGenerationProps {
  productImageUrl: string;
}

interface GeneratedModel {
  type: "male" | "female";
  imageUrl: string;
}

export function ModelGeneration({ productImageUrl }: ModelGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [styleInstructions, setStyleInstructions] = useState("");
  const [generatedModels, setGeneratedModels] = useState<GeneratedModel[]>([]);
  const [generationStatus, setGenerationStatus] = useState<string>("");

  const handleDownload = (imageUrl: string, modelType: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${modelType}-model-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateModels = async () => {
    if (!productImageUrl) {
      showToast.warning("Please upload a product image first");
      return;
    }

    setIsGenerating(true);
    setGenerationStatus("Analyzing product image...");
    setGeneratedModels([]);

    try {
      const response = await fetch("/api/generate-models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: productImageUrl,
          prompt:
            styleInstructions ||
            "Professional model wearing the product in a studio setting with good lighting",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate models");
      }

      setGenerationStatus("Processing generated images...");

      // Handle the API response
      if (data.success && data.generatedImage) {
        // Create base64 data URL for the generated image
        const imageDataUrl = `data:image/png;base64,${data.generatedImage}`;

        // For now, we'll create both male and female versions using the same generated image
        // In a real implementation, you might want to generate separate images for each
        const generatedModels: GeneratedModel[] = [
          {
            type: "male",
            imageUrl: imageDataUrl,
          },
          {
            type: "female",
            imageUrl: imageDataUrl,
          },
        ];

        setGeneratedModels(generatedModels);
        setGenerationStatus("Models generated successfully!");
      } else {
        throw new Error("No image data received from API");
      }
    } catch (error) {
      console.error("Error generating models:", error);
      showToast.error("Failed to generate models", "Please try again.");
      setGenerationStatus("");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Style Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Style Instructions (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={styleInstructions}
            onChange={(e) => setStyleInstructions(e.target.value)}
            placeholder="e.g., studio quality, lifestyle, commercial, outdoor setting, casual pose..."
            className="min-h-[120px] resize-none"
          />
        </CardContent>
      </Card>

      {/* Generation Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            className="w-full h-12 text-base font-semibold gap-2"
            onClick={handleGenerateModels}
            disabled={isGenerating || !productImageUrl}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {generationStatus}
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Model Images
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Models */}
      {generatedModels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Generated Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedModels.map((model, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={model.type === "male" ? "default" : "secondary"}
                      className="flex items-center gap-1"
                    >
                      <User className="h-3 w-3" />
                      {model.type === "male" ? "Male Model" : "Female Model"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(model.imageUrl, model.type)}
                    >
                      Download
                    </Button>
                  </div>
                  <div className="relative">
                    <img
                      src={model.imageUrl}
                      alt={`${model.type} model wearing product`}
                      className="w-full h-full aspect-square object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      AI Generated
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
