"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageIcon, Search, Download, Trash2, Loader2, X } from "lucide-react";
import { showToast } from "@/lib/toast";

interface GalleryImage {
  id: string;
  title: string;
  imageUrl: string;
  type: string;
  createdAt: string;
}

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = [
    { value: "all", label: "All Types" },
    { value: "PRODUCT_MODEL", label: "Product Model" },
    { value: "FASHION_TRYON", label: "Fashion Try-On" },
    { value: "PROMPT_TO_IMAGE", label: "Prompt to Image" },
    { value: "AI_PHOTOGRAPHY", label: "AI Photography" },
  ];

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  useEffect(() => {
    filterImages();
  }, [searchTerm, selectedCategory, images]);

  const fetchGalleryImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/gallery");

      if (!response.ok) {
        throw new Error("Failed to fetch gallery images");
      }

      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      showToast.error("Failed to load gallery", "Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const filterImages = () => {
    let filtered = images;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.type === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredImages(filtered);
  };

  const handleDownload = (imageUrl: string, title: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${title}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast.success("Download started", title);
  };

  const handleDelete = async (imageId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/gallery?id=${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      showToast.success("Image deleted", title);
      fetchGalleryImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      showToast.error("Failed to delete image", "Please try again");
    }
  };

  const getTypeLabel = (type: string) => {
    const category = categories.find((c) => c.value === type);
    return category?.label || type;
  };

  const openImageDialog = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  const closeImageDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => setSelectedImage(null), 200); // Wait for animation
  };

  const handleDeleteFromDialog = async () => {
    if (!selectedImage) return;

    closeImageDialog();
    await handleDelete(selectedImage.id, selectedImage.title);
  };

  const handleDownloadFromDialog = () => {
    if (!selectedImage) return;
    handleDownload(selectedImage.imageUrl, selectedImage.title);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search and Filter */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={
                    selectedCategory === category.value ? "default" : "outline"
                  }
                  className={`whitespace-nowrap ${
                    selectedCategory === category.value
                      ? "bg-orange-500 hover:bg-orange-600"
                      : ""
                  }`}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredImages.length}{" "}
            {filteredImages.length === 1 ? "image" : "images"}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        )}

        {/* Gallery Grid */}
        {!isLoading && filteredImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Image */}
                <div
                  className="relative aspect-square overflow-hidden bg-gray-100"
                  onClick={() => openImageDialog(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-contain bg-gray-100"
                  />

                  {/* Action Buttons Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-10 w-10 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(item.imageUrl, item.title);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-10 w-10 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id, item.title);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-sm line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{getTypeLabel(item.type)}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredImages.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <ImageIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No images yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start creating amazing images and save them to your gallery
            </p>
            {searchTerm || selectedCategory !== "all" ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            ) : null}
          </div>
        )}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 overflow-hidden">
          {selectedImage && (
            <>
              <DialogHeader className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <DialogTitle className="text-xl font-semibold">
                      {selectedImage.title}
                    </DialogTitle>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span>{getTypeLabel(selectedImage.type)}</span>
                      <span>•</span>
                      <span>
                        {new Date(selectedImage.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {/* Image Container */}
              <div className="relative bg-gray-100 flex items-center justify-center p-6 max-h-[60vh] overflow-auto">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleDownloadFromDialog}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteFromDialog}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
