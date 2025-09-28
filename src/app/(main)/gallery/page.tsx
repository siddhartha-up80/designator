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
  MoreVertical,
  Sparkles,
  TrendingUp,
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
    featured: true,
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
    trending: true,
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
    featured: true,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Modern Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-lg mb-4">
            <ImageIcon className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              Creative Gallery
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Browse your AI-generated fashion models, try-on results, and
              creative content. Organize, share, and manage your digital fashion
              portfolio with style.
            </p>
          </div>
        </div>

        {/* Modern Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search creations..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 h-12 rounded-2xl border-gray-200 bg-white/50 backdrop-blur-sm focus:bg-white transition-all"
              />
            </div>

            {/* Category Filters */}
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  className={`h-12 px-6 rounded-2xl font-semibold transition-all ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-white/50 border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category === "all" ? "All" : category}
                </Button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className={`h-10 px-4 rounded-xl transition-all ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className={`h-10 px-4 rounded-xl transition-all ${
                  viewMode === "list"
                    ? "bg-white shadow-sm"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-lg font-semibold text-gray-700">
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "creation" : "creations"}
            </p>
            <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 px-4 py-1 rounded-full">
              <Filter className="h-3 w-3 mr-2" />
              {selectedCategory === "all" ? "All Categories" : selectedCategory}
            </Badge>
          </div>
          <Button variant="outline" className="rounded-2xl">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Modern Gallery Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Floating Action Buttons */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        className="h-10 w-10 p-0 bg-white/90 hover:bg-white text-gray-700 shadow-lg rounded-full"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="h-10 w-10 p-0 bg-white/90 hover:bg-white text-gray-700 shadow-lg rounded-full"
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="h-10 w-10 p-0 bg-white/90 hover:bg-white text-gray-700 shadow-lg rounded-full"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                        item.type === "model"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      }`}
                    >
                      {item.type === "model" ? (
                        <>
                          <User className="h-3 w-3 mr-1" />
                          Model
                        </>
                      ) : (
                        <>
                          <Shirt className="h-3 w-3 mr-1" />
                          Try-On
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Special Badges */}
                  {item.featured && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}

                  {item.trending && (
                    <div className="absolute top-16 left-4">
                      <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span className="font-semibold">{item.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span className="font-semibold">{item.views}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs px-2 py-1 rounded-full bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Modern List View */
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute -top-2 -right-2">
                      <Badge
                        className={`px-2 py-1 rounded-full text-xs font-semibold shadow-lg ${
                          item.type === "model"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                        }`}
                      >
                        {item.type === "model" ? "Model" : "Try-On"}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 mt-1">{item.category}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-10 w-10 p-0 rounded-full"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-10 w-10 p-0 rounded-full"
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-10 w-10 p-0 rounded-full"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Stats and Date */}
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span className="font-semibold">
                          {item.likes} likes
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span className="font-semibold">
                          {item.views} views
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs px-3 py-1 rounded-full bg-gray-50 border-gray-200 text-gray-600"
                        >
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modern Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-8">
              <ImageIcon className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No creations found
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg leading-relaxed">
              We couldn't find any items matching your search criteria. Try
              adjusting your filters or search terms.
            </p>
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 h-auto rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setFilteredItems(mockGalleryItems);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
