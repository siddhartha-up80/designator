"use client";

import Link from "next/link";
// Footer component is imported above where needed
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LandingHeader } from "@/components/landing-header";
import Footer from "@/components/footer";
import { useBackgroundImage } from "@/hooks/use-images";
import { HorizontalImageCarousel } from "@/components/horizontal-image-carousel";
import { EnhancedImageCarousel } from "@/components/enhanced-image-carousel";
import { MarqueeImageCarousel } from "@/components/marquee-image-carousel";
import { CSSMarqueeCarousel } from "@/components/css-marquee-carousel";
import { ArrowRight, Check, Sparkles } from "lucide-react";

export default function LandingPage() {
  // Use the new universal image hook for background
  const {
    firstImage: backgroundImage,
    loading: isImageLoading,
    error,
  } = useBackgroundImage({
    quality: "large",
    orientation: "landscape",
  });

  // SEO structured data for the homepage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    name: "Designator",
    alternateName: "Designator - AI Fashion Model Generator",
    description:
      "Create stunning AI fashion models wearing your products instantly. Professional virtual try-on technology for brands, designers & marketers.",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web Browser",
    url: "https://designator.siddharthasingh.co.in",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free trial with 10 credits",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "150",
      bestRating: "5",
    },
    featureList: [
      "AI Fashion Model Generation",
      "Virtual Try-On Technology",
      "Product Visualization",
      "Fashion Photography AI",
      "Image Upscaling",
      "Prompt to Image Generation",
    ],
  };

  console.log("Background image state:", {
    backgroundImage,
    isImageLoading,
    error,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-background">
        <LandingHeader />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-red-950/20">
          <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
            <div className="text-center space-y-8">
              <Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Content Creation
              </Badge>

              <div className="space-y-6">
                <h1 className="text-5xl font-bold tracking-tight">
                  Transform Products Into
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-red-500">
                    {" "}
                    Stunning Visuals
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Upload your product images and generate professional model
                  photos, ads, and marketing content in minutes. No studio, no
                  expensive shoots—just perfect results.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-lg px-8 py-6 font-semibold">
                    Start Creating Free
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
              </div>
            </div>

            {/* AI-Generated Model Showcase Carousel */}
            <div className="mt-16">
              <CSSMarqueeCarousel duration={25} className="bg-transparent" />
            </div>
          </div>
        </section>

        {/* Do More With One Upload */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Maximize Impact With{" "}
                <span className="text-gradient bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                  Single Upload
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Transform one image into complete marketing campaigns—styled,
                professional, and ready to launch.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <Badge className="bg-rose-100 text-rose-800 border-rose-200">
                  Instant Content Suite
                </Badge>

                <div className="space-y-6">
                  <h3 className="text-3xl font-bold">
                    One Image. Endless Possibilities.
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Turn a single product shot into an entire content
                    library—complete with model photography, lifestyle visuals,
                    and marketing assets in just minutes.
                  </p>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span>
                      Multiple formats and dimensions generated automatically
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span>
                      Curated themes for retail, lifestyle, and social media
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span>
                      Consistent brand identity maintained across all visuals
                    </span>
                  </li>
                </ul>

                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
                    Start Generating
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-950/50 dark:to-pink-950/50 rounded-2xl p-8 h-96 flex items-center justify-center">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg max-w-xs w-full">
                    <div className="flex items-center justify-center mb-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-rose-500 border-t-transparent"></div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-rose-500 mb-2">
                        Designating Visuals
                      </div>
                      <div className="text-sm text-muted-foreground">
                        AI is crafting your brand story...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-background" id="features">
          <div className="max-w-7xl mx-auto px-6">
            {/* Fashion Try-On */}
            <div className="grid lg:grid-cols-2 gap-16 mt-20">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950/50 dark:to-purple-950/50 rounded-2xl p-8 flex items-center justify-center order-2 lg:order-1">
                <div className="text-center space-y-4">
                  <div className="w-64 h-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mx-auto">
                    <img
                      src="/images/model (1).jpg"
                      alt="Fashion model wearing generated outfit"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Professional model presentations from product photos—no
                    expensive photoshoots required.
                  </p>
                </div>
              </div>

              <div className="space-y-8 order-1 lg:order-2">
                <div className="space-y-8">
                  <Badge className="bg-rose-100 text-rose-800 border-rose-200">
                    Virtual Fashion Modeling
                  </Badge>
                  <h3 className="text-3xl font-bold">
                    Bring Your Designs to Life on Virtual Models.
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Transform flat garment photos into stunning model
                    presentations—no photoshoot required.
                  </p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span>
                      AI models adapted to showcase your brand aesthetic
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span>
                      Realistic fabric flow and garment fit visualization
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span>Various poses and editorial styling variations</span>
                  </li>
                </ul>

                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
                    Launch Virtual Modeling
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Model Photos → Product */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <Badge className="bg-rose-100 text-rose-800 border-rose-200">
                  Product Isolation & Enhancement
                </Badge>

                <div className="space-y-4">
                  <h3 className="text-3xl font-bold">
                    Extract Perfect Product Images from Any Context.
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Seamlessly isolate products from lifestyle shoots and create
                    polished, e-commerce ready visuals—ideal for online stores,
                    catalogs, and advertising campaigns.
                  </p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span>
                      Smart background removal with pristine transparent or
                      white backgrounds
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span>
                      Professional color grading and uniform lighting
                      enhancement
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span>
                      Platform-optimized dimensions for e-commerce and social
                      media
                    </span>
                  </li>
                </ul>

                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
                    Generate Product Visuals
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50 rounded-2xl p-8">
                <div className="bg-black rounded-xl aspect-[9/16] max-w-xs mx-auto overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
                  <img
                    src="/images/product (1).png"
                    alt="Product content preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="opacity-80">Premium Collection</div>
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
                <Badge className="bg-rose-100 text-rose-800 border-rose-200">
                  Professional AI Photography
                </Badge>

                <div className="space-y-4">
                  <h3 className="text-3xl font-bold">
                    Professional Brand Photography—Without the Studio.
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Perfect lighting, authentic colors, flawless shadows. Create
                    stunning visuals in any environment or setting you envision.
                  </p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span>
                      Lifestyle shoots, editorial layouts, hero shots, and clean
                      backgrounds—all automated
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span>Precision shadow and reflection customization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span>
                      High-resolution outputs with professional formatting
                      options
                    </span>
                  </li>
                </ul>

                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
                    Start Professional Shoots
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* AI Showcase Carousel */}
        <EnhancedImageCarousel
          title="AI-Generated Model Showcase"
          subtitle="See how our AI transforms ordinary product photos into stunning model presentations"
          badgeText="AI-Powered Results"
          autoScrollSpeed={4000}
          showControls={true}
          showProgress={true}
          className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
        />

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Universal Image API Background */}
          <div className="absolute inset-0">
            {/* Always show fallback background first */}
            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900" />

            {/* Show Pexels image overlay when loaded */}
            {backgroundImage && !isImageLoading && (
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 opacity-100"
                style={
                  {
                    "--bg-image": `url(${backgroundImage.url})`,
                    backgroundImage: "var(--bg-image)",
                  } as React.CSSProperties
                }
              />
            )}

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/50 dark:bg-black/70"></div>

            {/* Loading indicator */}
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/70 text-sm bg-black/20 px-3 py-1 rounded">
                  Loading background...
                </div>
              </div>
            )}

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] opacity-20"></div>
          </div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="bg-white/95 dark:bg-gray-900/90 backdrop-blur-lg rounded-3xl border border-white/20 dark:border-gray-700/50 p-12 lg:p-16 shadow-2xl shadow-black/25">
              <div className="text-center space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-medium border border-rose-200 dark:border-rose-800">
                  <Sparkles className="w-4 h-4" />
                  Start with free credits today
                </div>

                {/* Heading */}
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Designate Your Brand's Visual Future
                  </h2>
                  <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Join forward-thinking brands creating exceptional visual
                    content in minutes, not weeks. Start your creative journey
                    today.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="group bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-10 py-7 text-lg font-semibold rounded-2xl shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Start Creating for Free
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  <Link href="/documentation">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-gray-200 dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-600 px-8 py-7 text-lg font-medium rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-300"
                    >
                      View Documentation
                    </Button>
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Free credits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>No setup fees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>No hidden fees</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}
