"use client";

import { useState, useCallback } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  uploadedImageUrl?: string;
}

export function ImageUpload({
  onImageUploaded,
  uploadedImageUrl,
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { edgestore } = useEdgeStore();

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        showToast.warning("Please upload an image file");
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            setUploadProgress(progress);
          },
        });

        onImageUploaded(res.url);
      } catch (error) {
        console.error("Upload failed:", error);
        showToast.error("Failed to upload image", "Please try again.");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [edgestore, onImageUploaded]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const clearImage = useCallback(() => {
    onImageUploaded("");
  }, [onImageUploaded]);

  return (
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-sm sm:text-base md:text-lg font-semibold">
          Upload Product Image
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
        {uploadedImageUrl ? (
          <div className="relative">
            <img
              src={uploadedImageUrl}
              alt="Uploaded product"
              className="w-full max-h-64 sm:max-h-80 md:max-h-96 object-contain rounded-lg bg-muted"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-1 sm:top-2 right-1 sm:right-2 h-7 w-7 sm:h-8 sm:w-8 p-0"
              onClick={clearImage}
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 bg-green-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs md:text-sm flex items-center gap-1">
              <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              Uploaded
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center transition-colors cursor-pointer",
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50",
              isUploading && "pointer-events-none opacity-50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <Upload className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />

            {isUploading ? (
              <div className="space-y-2">
                <div className="text-xs sm:text-sm font-medium">
                  Uploading... {uploadProgress}%
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
                  <div
                    className="bg-primary h-1.5 sm:h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <Button className="mb-2 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
                  Choose Image
                </Button>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Click to browse, drag & drop, or paste
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  Supports JPG, PNG, WebP (max 10MB)
                </p>
              </>
            )}

            <input
              id="file-input"
              type="file"
              accept="image/*"
              className="hidden"
              title="Upload an image file"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
