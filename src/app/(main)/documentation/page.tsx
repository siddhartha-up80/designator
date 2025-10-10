"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Sparkles,
  Camera,
  Shirt,
  ArrowUpCircle,
  FileImage,
  Wand2,
  ImageIcon,
  CreditCard,
  Star,
  Clock,
  Zap,
  Eye,
  Download,
  ChevronRight,
  Package,
  MessageSquare,
  Upload,
  Grid3X3,
  Layers,
  RefreshCw,
  Shield,
  Users,
  Target,
} from "lucide-react";

const features = [
  {
    id: "product-model",
    title: "Product Model Generation",
    icon: Sparkles,
    description: "Generate professional model images wearing your products",
    category: "AI Generation",
    difficulty: "Beginner",
    time: "2-3 minutes",
    credits: "5 credits per image",
    color: "from-rose-500 to-pink-500",
  },
  {
    id: "prompt-to-image",
    title: "Prompt to Image",
    icon: Wand2,
    description: "Create stunning images from text descriptions",
    category: "AI Generation",
    difficulty: "Beginner",
    time: "1-2 minutes",
    credits: "3 credits per image",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "img-to-prompt",
    title: "Image to Prompt",
    icon: FileImage,
    description: "Generate detailed text descriptions from images",
    category: "AI Analysis",
    difficulty: "Beginner",
    time: "30 seconds",
    credits: "2 credits per analysis",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "photography",
    title: "Photography Enhancement",
    icon: Camera,
    description: "Enhance and stylize your photos with AI",
    category: "Photo Enhancement",
    difficulty: "Intermediate",
    time: "2-4 minutes",
    credits: "4 credits per enhancement",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "fashion-try-on",
    title: "Fashion Try-On",
    icon: Shirt,
    description: "Virtual try-on for clothing and accessories",
    category: "Fashion AI",
    difficulty: "Intermediate",
    time: "3-5 minutes",
    credits: "6 credits per try-on",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "gallery",
    title: "Gallery Management",
    icon: ImageIcon,
    description: "Organize and manage your generated content",
    category: "Organization",
    difficulty: "Beginner",
    time: "Instant",
    credits: "Free",
    color: "from-gray-500 to-slate-500",
  },
];

export default function DocumentationPage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-12">
          {/* Overview Section */}
          <div className="space-y-8">
            {/* What is Designator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  What is Designator?
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Designator is an AI-powered platform that revolutionizes
                  fashion and product photography. Create professional model
                  images, enhance photos, and bring your creative vision to life
                  - all without expensive photoshoots or professional models.
                </p>
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">
                      AI-Powered Generation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced AI models create realistic, professional-quality
                      images
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">Lightning Fast</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate professional content in minutes, not days or
                      weeks
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">Brand-Focused</h3>
                    <p className="text-sm text-muted-foreground">
                      Maintain consistent brand aesthetics across all your
                      visual content
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Feature List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">All Features</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {features.map((feature) => (
                      <button
                        key={feature.id}
                        onClick={() => setSelectedFeature(feature.id)}
                        className={`w-full p-4 text-left hover:bg-muted transition-colors border-b last:border-b-0 ${
                          selectedFeature === feature.id
                            ? "bg-primary/5 border-r-2 border-r-primary"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center shrink-0`}
                          >
                            <feature.icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {feature.title}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {feature.category}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Feature Details */}
              <div className="lg:col-span-2">
                {selectedFeature ? (
                  (() => {
                    const feature = features.find(
                      (f) => f.id === selectedFeature
                    );
                    if (!feature) return null;

                    return (
                      <Card>
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}
                            >
                              <feature.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-xl">
                                {feature.title}
                              </CardTitle>
                              <p className="text-muted-foreground mt-2">
                                {feature.description}
                              </p>
                              <div className="flex gap-2 mt-4">
                                <Badge>{feature.category}</Badge>
                                <Badge variant="outline">
                                  {feature.difficulty}
                                </Badge>
                                <Badge variant="secondary">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {feature.time}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="bg-primary/10 text-primary border-primary/20"
                                >
                                  <CreditCard className="h-3 w-3 mr-1" />
                                  {feature.credits}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {/* Feature-specific content */}
                          {feature.id === "product-model" && (
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-semibold mb-3">
                                  How it works:
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                                      1
                                    </div>
                                    <p className="text-sm">
                                      Upload your product image with a clean
                                      background
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                                      2
                                    </div>
                                    <p className="text-sm">
                                      Select model preferences (gender, age,
                                      style)
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                                      3
                                    </div>
                                    <p className="text-sm">
                                      Choose number of images and aspect ratio
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                                      4
                                    </div>
                                    <p className="text-sm">
                                      AI generates professional model photos in
                                      2-3 minutes
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="h-px bg-border my-4"></div>
                              <div>
                                <h4 className="font-semibold mb-3">
                                  Best for:
                                </h4>
                                <ul className="text-sm space-y-1 text-muted-foreground">
                                  <li>• E-commerce product photography</li>
                                  <li>• Fashion brand lookbooks</li>
                                  <li>• Social media marketing</li>
                                  <li>• Advertising campaigns</li>
                                </ul>
                              </div>
                            </div>
                          )}

                          {feature.id === "prompt-to-image" && (
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-semibold mb-3">
                                  Create anything with text:
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex gap-3">
                                    <Wand2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      Write detailed descriptions of what you
                                      want to create
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <Upload className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      Choose from multiple artistic styles and
                                      presets
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <Grid3X3 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      Adjust parameters for perfect results
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <Download className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      Generate multiple variations at once
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="h-px bg-border my-4"></div>
                              <div>
                                <h4 className="font-semibold mb-3">
                                  Popular use cases:
                                </h4>
                                <ul className="text-sm space-y-1 text-muted-foreground">
                                  <li>
                                    • Marketing visuals and advertisements
                                  </li>
                                  <li>• Social media content creation</li>
                                  <li>• Concept art and mood boards</li>
                                  <li>• Product mockups and presentations</li>
                                </ul>
                              </div>
                            </div>
                          )}

                          {feature.id === "fashion-try-on" && (
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-semibold mb-3">
                                  Virtual fitting process:
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex gap-3">
                                    <Upload className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      Upload model photo and garment image
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <Layers className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      AI analyzes fit and positioning
                                      automatically
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <RefreshCw className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      Generate realistic try-on results
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <Eye className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      Preview and download high-quality results
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="h-px bg-border my-4"></div>
                              <div>
                                <h4 className="font-semibold mb-3">
                                  Perfect for:
                                </h4>
                                <ul className="text-sm space-y-1 text-muted-foreground">
                                  <li>• Fashion e-commerce stores</li>
                                  <li>• Virtual styling services</li>
                                  <li>• Clothing brand catalogs</li>
                                  <li>• Personal styling apps</li>
                                </ul>
                              </div>
                            </div>
                          )}

                          {feature.id === "img-to-prompt" && (
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-semibold mb-3">
                                  AI-powered image analysis:
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex gap-3">
                                    <Upload className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      Upload any image for detailed analysis
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <Eye className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      AI examines composition, colors, and style
                                      elements
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      Generate comprehensive text descriptions
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <Download className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      Copy prompts for use in other AI tools
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="h-px bg-border my-4"></div>
                              <div>
                                <h4 className="font-semibold mb-3">
                                  Perfect for:
                                </h4>
                                <ul className="text-sm space-y-1 text-muted-foreground">
                                  <li>
                                    • Reverse engineering successful designs
                                  </li>
                                  <li>• Creating prompts for similar images</li>
                                  <li>• Understanding image composition</li>
                                  <li>• Content analysis and cataloging</li>
                                </ul>
                              </div>
                            </div>
                          )}

                          {feature.id === "photography" && (
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-semibold mb-3">
                                  Professional photo enhancement:
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex gap-3">
                                    <Upload className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      Upload photos for AI-powered enhancement
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      Apply professional filters and adjustments
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <Grid3X3 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      Fine-tune lighting, contrast, and colors
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <Download className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      Download enhanced high-resolution images
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="h-px bg-border my-4"></div>
                              <div>
                                <h4 className="font-semibold mb-3">
                                  Best for:
                                </h4>
                                <ul className="text-sm space-y-1 text-muted-foreground">
                                  <li>• Product photography improvement</li>
                                  <li>• Social media content enhancement</li>
                                  <li>• Professional portfolio creation</li>
                                  <li>• Brand consistency across images</li>
                                </ul>
                              </div>
                            </div>
                          )}

                          {feature.id === "gallery" && (
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-semibold mb-3">
                                  Organize your creations:
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex gap-3">
                                    <Grid3X3 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      View all generated images in one place
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <Upload className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      Search and filter by date or feature type
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <Download className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      Bulk download multiple images
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <Eye className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                      Preview images with generation details
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="h-px bg-border my-4"></div>
                              <div>
                                <h4 className="font-semibold mb-3">
                                  Features include:
                                </h4>
                                <ul className="text-sm space-y-1 text-muted-foreground">
                                  <li>
                                    • Automatic organization by feature type
                                  </li>
                                  <li>• Generation history and metadata</li>
                                  <li>• Favorite images bookmarking</li>
                                  <li>• Easy sharing and export options</li>
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Placeholder for any remaining features */}
                          {![
                            "product-model",
                            "prompt-to-image",
                            "fashion-try-on",
                            "img-to-prompt",
                            "photography",
                            "gallery",
                          ].includes(feature.id) && (
                            <div className="text-center py-8 text-muted-foreground">
                              <feature.icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>
                                Detailed documentation for {feature.title}{" "}
                                coming soon!
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })()
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <h3 className="font-semibold mb-2">
                        Select a feature to learn more
                      </h3>
                      <p className="text-muted-foreground">
                        Choose any feature from the list to see detailed
                        documentation, usage examples, and best practices.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center py-8 border-t">
            <p className="text-muted-foreground mb-4">
              Need more help? Our support team is here to assist you.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
