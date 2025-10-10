"use client";

import React from "react";
import { HorizontalImageCarousel } from "@/components/horizontal-image-carousel";
import { EnhancedImageCarousel } from "@/components/enhanced-image-carousel";
import { AuthHeader } from "@/components/auth-header";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, TrendingUp } from "lucide-react";

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-red-950/20">
          <div className="max-w-4xl mx-auto text-center space-y-6 px-6">
            <Badge className="bg-rose-100 text-rose-800 border-rose-200">
              <Star className="w-4 h-4 mr-2" />
              Showcase Gallery
            </Badge>
            <h1 className="text-5xl font-bold">
              AI-Generated
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                {" "}
                Model Showcase
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of fashion photography with our AI-powered
              platform. See real examples of product transformations.
            </p>
          </div>
        </section>

        {/* Enhanced Carousel */}
        <EnhancedImageCarousel
          title="Premium AI Collections"
          subtitle="Interactive showcase with advanced features - hover, like, and explore"
          badgeText="Enhanced Experience"
          autoScrollSpeed={4000}
          direction="left"
          showControls={true}
          showProgress={true}
          className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20"
        />

        {/* Standard Carousel - Left Direction */}
        <HorizontalImageCarousel
          title="AI-Powered Fashion Showcase"
          subtitle="Discover how our AI transforms product images into stunning model presentations"
          badgeText="Live AI Results"
          autoScrollSpeed={3000}
          className="bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-red-950/20"
        />

        {/* Enhanced Carousel - Right Direction */}
        <EnhancedImageCarousel
          title="Trending Model Styles"
          subtitle="Browse our most popular AI-generated model presentations"
          badgeText="Trending Now"
          autoScrollSpeed={3500}
          direction="right"
          showControls={true}
          showProgress={false}
          className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20"
        />

        {/* Professional Results Carousel */}
        <HorizontalImageCarousel
          title="Professional Photography Made Easy"
          subtitle="See the before and after transformation of ordinary products"
          badgeText="Professional Results"
          autoScrollSpeed={4500}
          className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20"
        />

        {/* Business Success Carousel */}
        <HorizontalImageCarousel
          title="Trusted by Leading Brands"
          subtitle="Join thousands of brands creating exceptional visual content with AI"
          badgeText="Industry Leaders"
          autoScrollSpeed={3500}
          className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
        />

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-br from-rose-500 via-pink-500 to-red-500">
          <div className="max-w-4xl mx-auto text-center space-y-8 px-6">
            <Badge className="bg-white/20 text-white border-white/30">
              <TrendingUp className="w-4 h-4 mr-2" />
              Start Creating Today
            </Badge>
            <h2 className="text-4xl font-bold text-white">
              Ready to Transform Your Products?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of brands already using our AI to create stunning
              model presentations. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-rose-600 hover:bg-rose-50 px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200">
                <Sparkles className="w-5 h-5 mr-2 inline" />
                Start Free Trial
              </button>
              <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200">
                View Pricing
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
