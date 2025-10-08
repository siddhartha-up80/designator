"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LandingHeader } from "@/components/landing-header";
import {
  ArrowRight,
  Check,
  X,
  Upload,
  Sparkles,
  Image,
  Video,
  Zap,
  Clock,
  Palette,
  Users,
  Star,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-pink-950/20">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="text-center space-y-8">
            <Badge className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Fashion Revolution
            </Badge>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                Transform Products Into
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
                  {" "}
                  Stunning Visuals
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Upload your product images and generate professional model
                photos, ads, and marketing content in minutes. No studio, no
                expensive shoots—just perfect results.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-6 text-lg font-semibold"
                >
                  Start Creating Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold"
              >
                <Users className="w-5 h-5 mr-2" />
                Book a Demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span>Rated 5/5</span>
              </div>
              <div>Used by 1700+ brands</div>
              <div>Full commercial rights</div>
            </div>
          </div>

          {/* Sample Images Showcase */}
          <div className="mt-16 relative">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 overflow-hidden rounded-2xl">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden"
                >
                  <img
                    src={`/images/model (${Math.min(i, 7)}).jpg`}
                    alt={`Generated model ${i}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                Trusted by forward-thinking brands
              </p>
              <div className="flex justify-center items-center gap-8 mt-4 opacity-60">
                <div className="w-20 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center text-white font-bold text-xs">
                  BRAND
                </div>
                <div className="w-20 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded flex items-center justify-center text-white font-bold text-xs">
                  STYLE
                </div>
                <div className="w-20 h-8 bg-gradient-to-r from-pink-500 to-rose-600 rounded flex items-center justify-center text-white font-bold text-xs">
                  SHOP
                </div>
                <div className="w-20 h-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                  TREND
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Do More With One Upload */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Do More With{" "}
              <span className="text-gradient bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                One Upload
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Products, models and campaigns—generated, on-brand, ready to ship.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                One Click Generation
              </Badge>

              <div className="space-y-6">
                <h3 className="text-3xl font-bold">
                  Upload Once. Create Everything.
                </h3>
                <p className="text-lg text-muted-foreground">
                  From a single product photo, generate professional model
                  shoots, lifestyle scenes, and marketing variants in minutes.
                </p>
              </div>

              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Batch outputs across sizes and aspect ratios</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Style presets for fashion, lifestyle, and social</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Brand colors and aesthetics preserved</span>
                </li>
              </ul>

              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Start Generating
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-950/50 dark:to-pink-950/50 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg max-w-xs w-full">
                  <div className="flex items-center justify-center mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500 mb-2">
                      Generating Models
                    </div>
                    <div className="text-sm text-muted-foreground">
                      AI is creating your perfect campaign...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Designator VS Traditional */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gradient bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Designator
              </span>{" "}
              VS Traditional Shoots
            </h2>
            <p className="text-xl text-muted-foreground">
              Ship more creative content, spend less time and budget. Keep your
              brand intact.
            </p>

            <div className="flex justify-center gap-8 mt-8 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span>10x faster concept-to-publish</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span>Up to 90% lower cost</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span>More winning creatives</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Designator AI */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-green-200 dark:border-green-800">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">
                    Designator AI
                  </h3>
                  <p className="text-green-600 dark:text-green-500 font-medium">
                    Fast • On-brand • Scalable
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        Generate hundreds of{" "}
                        <strong>photos, videos, and ads</strong> in one click
                        from single image
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        Go from concept to publish in <strong>minutes</strong>,
                        not weeks
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        Brand-true outputs:{" "}
                        <strong>logos, color codes, style</strong> preserved
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        Instant try-on — <strong>any model</strong> Fashion fit
                        for any body type
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        <strong>AI enhancement</strong>, premium quality, and
                        thousands of ready templates
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        <strong>Full commercial rights</strong> included by
                        default
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        <strong>No Creative Limits</strong> required
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Traditional Studio */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-red-200 dark:border-red-800">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-red-700 dark:text-red-400">
                    Traditional Studio
                  </h3>
                  <p className="text-red-600 dark:text-red-500 font-medium">
                    Slow • Expensive • Inconsistent
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        Booking, logistics, sets, crew, models —{" "}
                        <strong>days to weeks</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        Per SKU cost balloons:{" "}
                        <strong>day rates + reshoots + retouching</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        Small changes mean <strong>new shoots</strong> and{" "}
                        <strong>missed deadlines</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        Limited test volume — <strong>fewer concepts</strong>,
                        fewer winners
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        Hard to scale — <strong>talent bottlenecks</strong> and
                        geographic limits
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        Weather, lighting, and location{" "}
                        <strong>dependencies</strong> delay shoots
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="text-6xl font-bold">VS</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* On-Brand Ads */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold">
                  On-Brand Ads, Formatted For Every Channel.
                </h3>
                <p className="text-lg text-muted-foreground">
                  Generate dozens of variants, swap hooks, and ship the winners
                  fast.
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Auto layout for 1:1, 4:5, 9:16, 16:9</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Safe zone and compliance overlays</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Bulk export with naming conventions</span>
                </li>
              </ul>

              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Create Ads
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-orange-100 dark:from-pink-950/50 dark:to-orange-950/50 rounded-2xl p-8 flex items-center justify-center">
              <div className="w-full max-w-sm space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-orange-300 text-center">
                  <Upload className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Upload Your Image
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">↓</div>
                  <p className="text-sm text-muted-foreground">AI Processing</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-square bg-gradient-to-br from-red-100 to-pink-200 dark:from-red-950 dark:to-pink-950 rounded-lg"></div>
                  <div className="aspect-square bg-gradient-to-br from-orange-100 to-yellow-200 dark:from-orange-950 dark:to-yellow-950 rounded-lg"></div>
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-200 dark:from-blue-950 dark:to-purple-950 rounded-lg"></div>
                  <div className="aspect-square bg-gradient-to-br from-green-100 to-teal-200 dark:from-green-950 dark:to-teal-950 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Fashion Try-On */}
          <div className="grid lg:grid-cols-2 gap-16 mt-20">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950/50 dark:to-purple-950/50 rounded-2xl p-8 flex items-center justify-center order-2 lg:order-1">
              <div className="text-center space-y-4">
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                  Fashion Try-On — on Model
                </Badge>
                <div className="w-64 h-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mx-auto">
                  <img
                    src="/images/model (1).jpg"
                    alt="Fashion model wearing generated outfit"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Realistic try-ons from flat-lay shots—no casting, no reshoots.
                </p>
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold">
                  Turn Product Photos Into On-Model Looks.
                </h3>
                <p className="text-lg text-muted-foreground">
                  Realistic try-ons from flat-lay shots—no casting, no reshoots.
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Virtual fitting on diverse body types</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Fabric texture and drape simulation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Multiple poses and styling options</span>
                </li>
              </ul>

              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Try Fashion AI
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Generation */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                AI Video Creation
              </Badge>

              <div className="space-y-4">
                <h3 className="text-3xl font-bold">
                  Scroll-Stopping Videos In Seconds.
                </h3>
                <p className="text-lg text-muted-foreground">
                  Reels, stories, product demos, and quick explainers that fit
                  platform safe-zones.
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>
                    Templates for Instagram, TikTok, and YouTube Shorts
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Auto scene generation from images</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Upscale video upto 4k (coming soon)</span>
                </li>
              </ul>

              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Create Videos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50 rounded-2xl p-8">
              <div className="bg-black rounded-xl aspect-[9/16] max-w-xs mx-auto overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
                <img
                  src="/images/product (1).png"
                  alt="Video content preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-sm font-bold">VINTAGE BLOOD</div>
                  <div className="text-xs opacity-80">Premium Collection</div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Photos */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-blue-300 text-center">
                  <div className="text-blue-500 font-medium">
                    Generate high quality product photography images.
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <img
                    src="/images/product (2).png"
                    alt="Product 1"
                    className="rounded-lg aspect-square object-cover"
                  />
                  <img
                    src="/images/product (3).png"
                    alt="Product 2"
                    className="rounded-lg aspect-square object-cover"
                  />
                  <img
                    src="/images/product (4).png"
                    alt="Product 3"
                    className="rounded-lg aspect-square object-cover"
                  />
                  <img
                    src="/images/product (5).png"
                    alt="Product 4"
                    className="rounded-lg aspect-square object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                AI Photography
              </Badge>

              <div className="space-y-4">
                <h3 className="text-3xl font-bold">
                  Studio-Grade Product Photos—No Studio.
                </h3>
                <p className="text-lg text-muted-foreground">
                  Consistent lighting, true colors, clean shadows. Any
                  background, any setting.
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>
                    Lifestyle, flat-lay, hero, and on-white in one flow
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Shadow and reflection controls</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Export-ready PNG/JPG with trim & bleed options</span>
                </li>
              </ul>

              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Create Studio Photos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-pink-950/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready To Get Started?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join Designator To Create Professional Content At Scale.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-6 text-lg font-semibold"
                >
                  Get Started For Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold"
              >
                <Users className="w-5 h-5 mr-2" />
                Book a Demo
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Trusted by forward-thinking brands
            </p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="w-20 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center text-white font-bold text-xs">
                BRAND
              </div>
              <div className="w-20 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded flex items-center justify-center text-white font-bold text-xs">
                STYLE
              </div>
              <div className="w-20 h-8 bg-gradient-to-r from-pink-500 to-rose-600 rounded flex items-center justify-center text-white font-bold text-xs">
                SHOP
              </div>
              <div className="w-20 h-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                TREND
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <img
                  src="/designator.png"
                  alt="Designator"
                  className="h-8 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Designator AI turns any product photos into amazing photos,
                videos, and ads that makes your brand stand out. No expensive
                studio, no hassle, just great content that sells.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <span>✉</span>
                  <span>hello@designator.studio</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>Mumbai, India</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Services</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <Link
                    href="/product-model"
                    className="hover:text-white transition-colors"
                  >
                    Product Model Generation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/photography"
                    className="hover:text-white transition-colors"
                  >
                    AI Photography
                  </Link>
                </li>
                <li>
                  <Link
                    href="/video"
                    className="hover:text-white transition-colors"
                  >
                    AI Video Creation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fashion-try-on"
                    className="hover:text-white transition-colors"
                  >
                    Fashion Try-On
                  </Link>
                </li>
                <li>
                  <Link
                    href="/upscale"
                    className="hover:text-white transition-colors"
                  >
                    Image Enhancement
                  </Link>
                </li>
              </ul>
            </div>

            {/* Use Cases */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Use Cases</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>Fashion & Apparel</li>
                <li>Beauty & Cosmetics</li>
                <li>Electronics & Gadgets</li>
                <li>Home & Lifestyle</li>
                <li>Jewelry & Accessories</li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Company</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <Link
                    href="/gallery"
                    className="hover:text-white transition-colors"
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/buy-credits"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                © 2025 Designator. All rights reserved.
              </div>
              <div className="flex gap-6">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-xs">in</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-xs">x</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
