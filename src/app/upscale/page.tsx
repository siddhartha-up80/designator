"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/image-upload";
import {
  ArrowUpCircle,
  Download,
  Zap,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

export default function UpscalePage() {
  const [uploadedImage, setUploadedImage] = useState("");
  const [selectedMultiplier, setSelectedMultiplier] = useState("4x");
  const [isProcessing, setIsProcessing] = useState(false);
  const [upscaledImage, setUpscaledImage] = useState("");

  const handleUpscale = async () => {
    if (!uploadedImage) {
      alert("Please upload an image first");
      return;
    }

    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setUpscaledImage(uploadedImage);
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <ArrowUpCircle className="h-8 w-8 text-primary" />
            Image Upscaler Pro
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enhance your images with AI-powered upscaling. Increase resolution
            up to 16x while preserving quality and adding intelligent detail
            enhancement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Upload Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onImageUploaded={setUploadedImage}
                  uploadedImageUrl={uploadedImage}
                />
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Upscale Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {["2x", "4x", "8x", "16x"].map((multiplier) => (
                    <Button
                      key={multiplier}
                      variant={
                        selectedMultiplier === multiplier
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedMultiplier(multiplier)}
                    >
                      {multiplier}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upscale Button */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  className="w-full"
                  onClick={handleUpscale}
                  disabled={isProcessing || !uploadedImage}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Enhance Image
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {uploadedImage && (
              <Card>
                <CardHeader>
                  <CardTitle>Before & After</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        Original
                      </Badge>
                      <img
                        src={uploadedImage}
                        alt="Original"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <Badge variant="default" className="mb-2">
                        Enhanced
                      </Badge>
                      {upscaledImage ? (
                        <img
                          src={upscaledImage}
                          alt="Enhanced"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                          <p className="text-muted-foreground">
                            Enhanced version will appear here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={!upscaledImage}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Enhanced Image
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
