"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ImageIcon,
  Search,
  Filter,
  Download,
  Heart,
  Share,
  Eye,
  Grid3X3,
  List,
  Calendar,
  Tag,
  User,
  Shirt,
} from "lucide-react";

const mockGalleryItems = [
  {
    id: 1,
    type: "model",
    title: "Summer Dress Model",
    imageUrl:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop",
    createdAt: "2025-09-15",
    likes: 24,
    views: 156,
    tags: ["summer", "dress", "female"],
    category: "Fashion Model",
  },
  {
    id: 2,
    type: "try-on",
    title: "Casual Shirt Try-On",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    createdAt: "2025-09-14",
    likes: 18,
    views: 89,
    tags: ["casual", "shirt", "male"],
    category: "Try-On Result",
  },
  {
    id: 3,
    type: "model",
    title: "Evening Gown Elegance",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b2e7d2e6?w=400&h=600&fit=crop",
    createdAt: "2025-09-13",
    likes: 42,
    views: 234,
    tags: ["evening", "gown", "elegant"],
    category: "Fashion Model",
  },
  {
    id: 4,
    type: "model",
    title: "Sporty Athleisure Look",
    imageUrl:
      "https://images.unsplash.com/photo-1506629905607-d405650655ba?w=400&h=600&fit=crop",
    createdAt: "2025-09-12",
    likes: 31,
    views: 178,
    tags: ["sport", "athleisure", "fitness"],
    category: "Fashion Model",
  },
  {
    id: 5,
    type: "try-on",
    title: "Business Suit Perfect Fit",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop",
    createdAt: "2025-09-11",
    likes: 27,
    views: 145,
    tags: ["business", "suit", "professional"],
    category: "Try-On Result",
  },
  {
    id: 6,
    type: "model",
    title: "Bohemian Style Dress",
    imageUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
    createdAt: "2025-09-10",
    likes: 35,
    views: 201,
    tags: ["bohemian", "style", "dress"],
    category: "Fashion Model",
  },
];

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredItems, setFilteredItems] = useState(mockGalleryItems);

  const categories = ["all", "Fashion Model", "Try-On Result"];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterItems(term, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterItems(searchTerm, category);
  };

  const filterItems = (search: string, category: string) => {
    let filtered = mockGalleryItems;

    if (category !== "all") {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    setFilteredItems(filtered);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <ImageIcon className="h-8 w-8 text-primary" />
            Creative Gallery
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse your AI-generated fashion models, try-on results, and
            creative content. Organize, share, and manage your digital fashion
            portfolio.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, tags, or category..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleCategoryFilter(category)}
                  >
                    {category === "all" ? "All" : category}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing {filteredItems.length} of {mockGalleryItems.length} items
          </p>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Filter className="h-3 w-3" />
            {selectedCategory === "all" ? "All Categories" : selectedCategory}
          </Badge>
        </div>

        {/* Gallery Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="group hover:shadow-lg transition-all duration-200"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded-t-lg" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                        >
                          <Heart className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                        >
                          <Share className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge
                        variant={
                          item.type === "model" ? "default" : "secondary"
                        }
                      >
                        {item.type === "model" ? (
                          <User className="h-3 w-3 mr-1" />
                        ) : (
                          <Shirt className="h-3 w-3 mr-1" />
                        )}
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.createdAt}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {item.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.views}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold">{item.title}</h3>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Heart className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge
                          variant={
                            item.type === "model" ? "default" : "secondary"
                          }
                        >
                          {item.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {item.createdAt}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {item.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.views}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setFilteredItems(mockGalleryItems);
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
