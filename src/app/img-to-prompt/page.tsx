"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
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

export default function ImgToPromptPage() {
  const [uploadedImage, setUploadedImage] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("detailed");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState("");

  const handleAnalyzeImage = async () => {
    if (!uploadedImage) {
      alert("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const mockPrompts = [
        "A professional fashion model wearing an elegant black evening dress, standing against a minimalist white background with soft studio lighting, showcasing the dress's flowing silhouette and intricate details",
        "Portrait of a confident young woman in sophisticated black formal wear, captured with professional photography lighting, emphasizing the garment's texture and fit, commercial fashion photography style",
        "High-fashion editorial shot featuring a model in a stunning black dress, dramatic lighting with soft shadows, clean composition with negative space, luxury brand aesthetic, shot with 85mm lens",
      ];

      setGeneratedPrompts(mockPrompts);
      setAnalysisResult(
        "Fashion photography, professional model, evening wear, studio lighting, commercial style"
      );
      setIsAnalyzing(false);
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <FileImage className="h-8 w-8 text-primary" />
            Image to Prompt Generator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transform your images into detailed text prompts for AI generation.
            Perfect for creating consistent style descriptions and training
            data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Upload Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onImageUploaded={setUploadedImage}
                  uploadedImageUrl={uploadedImage}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Upload any image to generate detailed text prompts describing
                  its content
                </p>
              </CardContent>
            </Card>

            {/* Prompt Style Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Prompt Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  className="w-full h-12 text-base font-semibold"
                  onClick={handleAnalyzeImage}
                  disabled={isAnalyzing || !uploadedImage}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-5 w-5 mr-2" />
                      Generate Prompts
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Prompts */}
            {generatedPrompts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Generated Prompts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedPrompts.map((prompt, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Variation {index + 1}</Badge>
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
                        className="min-h-[100px] resize-none"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Image Preview */}
            {uploadedImage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Source Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={uploadedImage}
                    alt="Source"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Analysis Results */}
            {analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Key Elements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{analysisResult}</p>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled={generatedPrompts.length === 0}
                  onClick={() => {
                    const allPrompts = generatedPrompts.join("\n\n---\n\n");
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
                  Use in Image Generation
                </Button>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
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
              <CardHeader>
                <CardTitle className="text-sm">Pro Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>• High-quality images produce better prompts</p>
                <p>• Use "Technical Details" for precise descriptions</p>
                <p>• "Commercial Use" is great for product descriptions</p>
                <p>• Edit generated prompts to fit your needs</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
