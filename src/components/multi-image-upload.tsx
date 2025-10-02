"use client";

import { useState, useCallback, useRef } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { Button } from "@/components/ui/button";
import { Upload, X, Plus, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";

interface UploadedImage {
  id: string;
  url: string;
  file: File;
}

interface MultiImageUploadProps {
  onImagesChange: (images: UploadedImage[]) => void;
  uploadedImages: UploadedImage[];
  maxImages?: number;
  className?: string;
}

export function MultiImageUpload({
  onImagesChange,
  uploadedImages,
  maxImages = 5,
  className,
}: MultiImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const { edgestore } = useEdgeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length === 0) {
        showToast.warning("Please upload image files only");
        return;
      }

      if (uploadedImages.length + imageFiles.length > maxImages) {
        showToast.warning(`You can upload a maximum of ${maxImages} images`);
        return;
      }

      const newUploadingSet = new Set(uploadingFiles);
      const newImages: UploadedImage[] = [];

      for (const file of imageFiles) {
        const fileId = `${file.name}-${Date.now()}-${Math.random()}`;
        newUploadingSet.add(fileId);
        setUploadingFiles(new Set(newUploadingSet));

        try {
          const res = await edgestore.publicFiles.upload({
            file,
            onProgressChange: (progress) => {
              // You could add progress tracking per file here if needed
            },
          });

          newImages.push({
            id: fileId,
            url: res.url,
            file,
          });
        } catch (error) {
          console.error("Upload failed:", error);
          showToast.error(`Failed to upload ${file.name}`, "Please try again.");
        } finally {
          newUploadingSet.delete(fileId);
          setUploadingFiles(new Set(newUploadingSet));
        }
      }

      if (newImages.length > 0) {
        onImagesChange([...uploadedImages, ...newImages]);
      }
    },
    [uploadedImages, maxImages, onImagesChange, edgestore, uploadingFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileUpload(files);
      }
      // Reset the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleFileUpload]
  );

  const removeImage = useCallback(
    (imageId: string) => {
      onImagesChange(uploadedImages.filter((img) => img.id !== imageId));
    },
    [uploadedImages, onImagesChange]
  );

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        className={cn(
          "relative border-2 border-dashed rounded-lg cursor-pointer transition-colors",
          "hover:border-primary/50 hover:bg-muted/25",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
          uploadedImages.length >= maxImages && "opacity-50 cursor-not-allowed",
          uploadedImages.length === 0 ? "p-6" : "p-3" // More padding when empty
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploadedImages.length >= maxImages}
          aria-label="Upload multiple images"
        />

        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div
            className={cn(
              "p-2 bg-muted rounded-lg",
              uploadedImages.length === 0 && "p-3" // Larger icon when empty
            )}
          >
            <ImageIcon
              className={cn(
                "text-muted-foreground",
                uploadedImages.length === 0 ? "h-8 w-8" : "h-6 w-6"
              )}
            />
          </div>
          <div>
            <p
              className={cn(
                "font-medium",
                uploadedImages.length === 0 ? "text-base" : "text-sm"
              )}
            >
              {uploadedImages.length >= maxImages
                ? `Maximum ${maxImages} images reached`
                : uploadedImages.length === 0
                ? "Upload images"
                : "Add more images"}
            </p>
            <p className="text-xs text-muted-foreground">
              {uploadedImages.length >= maxImages
                ? "Remove an image to add more"
                : "Drag & drop or click to upload"}
            </p>
          </div>
        </div>

        {uploadingFiles.size > 0 && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading {uploadingFiles.size} image
              {uploadingFiles.size > 1 ? "s" : ""}...
            </div>
          </div>
        )}
      </div>

      {/* Image Previews */}
      {uploadedImages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {uploadedImages.map((image) => (
            <div
              key={image.id}
              className="relative group bg-muted rounded-lg overflow-hidden w-20 h-20"
            >
              <img
                src={image.url}
                alt={`Uploaded ${image.file.name}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(image.id);
                }}
                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {image.file.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Count */}
      {uploadedImages.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {uploadedImages.length} of {maxImages} images uploaded
        </p>
      )}
    </div>
  );
}
