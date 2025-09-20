"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/image-upload";
import {
  Video,
  Play,
  Pause,
  Download,
  RotateCcw,
  Settings,
  Zap,
  Clock,
  Film,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

const videoTemplates = [
  {
    id: 1,
    name: "Fashion Showcase",
    duration: "5-10s",
    style: "Smooth rotation with zoom",
    preview:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Product Reveal",
    duration: "3-5s",
    style: "Dramatic reveal effect",
    preview:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Style Transition",
    duration: "8-12s",
    style: "Outfit transformation",
    preview:
      "https://images.unsplash.com/photo-1494790108755-2616b2e7d2e6?w=300&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Lifestyle Loop",
    duration: "10-15s",
    style: "Continuous lifestyle motion",
    preview:
      "https://images.unsplash.com/photo-1506629905607-d405650655ba?w=300&h=200&fit=crop",
  },
];

export default function VideoPage() {
  const [uploadedImage, setUploadedImage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [customPrompt, setCustomPrompt] = useState("");

  const handleGenerateVideo = async () => {
    if (!uploadedImage) {
      alert("Please upload an image first");
      return;
    }

    if (!selectedTemplate && !customPrompt) {
      alert("Please select a template or enter a custom prompt");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate video generation progress
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setGeneratedVideo(
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
          );
          setIsGenerating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <Video className="h-8 w-8 text-primary" />
            Video Creation Studio
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transform your fashion images into dynamic videos. Create engaging
            content for social media, marketing campaigns, and product
            showcases.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Source Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onImageUploaded={setUploadedImage}
                  uploadedImageUrl={uploadedImage}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Upload a fashion photo or model image to animate
                </p>
              </CardContent>
            </Card>

            {/* Video Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  Video Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videoTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedTemplate === template.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <img
                        src={template.preview}
                        alt={template.name}
                        className="w-full h-24 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold text-sm mb-1">
                        {template.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Clock className="h-3 w-3" />
                        {template.duration}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {template.style}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Prompt */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Custom Animation (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="custom-prompt">Animation Description</Label>
                  <Input
                    id="custom-prompt"
                    placeholder="e.g., slow motion fabric flow, dramatic lighting change, 360 rotation..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Describe the type of animation or movement you want to create
                </p>
              </CardContent>
            </Card>

            {/* Generation Button */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  className="w-full h-12 text-base font-semibold"
                  onClick={handleGenerateVideo}
                  disabled={isGenerating || !uploadedImage}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating Video... {generationProgress}%
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Generate Video
                    </>
                  )}
                </Button>
                {isGenerating && (
                  <div className="mt-4">
                    <div className="bg-secondary rounded-full h-2 overflow-hidden">
                      <div
                        className={`bg-primary h-2 rounded-full transition-all duration-500 ${
                          generationProgress === 0
                            ? "w-0"
                            : generationProgress <= 10
                            ? "w-[10%]"
                            : generationProgress <= 25
                            ? "w-1/4"
                            : generationProgress <= 50
                            ? "w-1/2"
                            : generationProgress <= 75
                            ? "w-3/4"
                            : generationProgress >= 100
                            ? "w-full"
                            : "w-3/4"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview & Controls */}
          <div className="space-y-6">
            {/* Video Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Video Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedVideo ? (
                  <div className="space-y-4">
                    <video
                      controls
                      className="w-full h-48 bg-black rounded-lg"
                      poster={uploadedImage}
                    >
                      <source src={generatedVideo} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                ) : uploadedImage ? (
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Source"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <p className="text-white text-sm">
                        Video preview will appear here
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">
                      Upload an image to start
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Video Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Output Quality</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      720p
                    </Button>
                    <Button variant="default" size="sm" className="text-xs">
                      1080p
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      4K
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Duration</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      5s
                    </Button>
                    <Button variant="default" size="sm" className="text-xs">
                      10s
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      15s
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Frame Rate</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      24 FPS
                    </Button>
                    <Button variant="default" size="sm" className="text-xs">
                      30 FPS
                    </Button>
                  </div>
                </div>
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
                    <Camera className="h-4 w-4 text-primary" />
                    <span>Professional animations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Film className="h-4 w-4 text-primary" />
                    <span>Multiple video formats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>AI-powered motion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-primary" />
                    <span>Social media ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
