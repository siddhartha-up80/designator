"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/landing-header";
import { Star, UserIcon } from "lucide-react";

export default function LandingPage() {
  const productImages = [
    "/api/placeholder/150/200",
    "/api/placeholder/150/200",
    "/api/placeholder/150/200",
    "/api/placeholder/150/200",
    "/api/placeholder/150/200",
    "/api/placeholder/150/200",
    "/api/placeholder/150/200",
    "/api/placeholder/150/200",
    "/api/placeholder/150/200",
    "/api/placeholder/150/200",
    "/api/placeholder/150/200",
    "/api/placeholder/150/200",
  ];

  const brandLogos = [
    { name: "Kornit", logo: "/api/placeholder/80/40" },
    { name: "Level Squad", logo: "/api/placeholder/80/40" },
    { name: "Meta", logo: "/api/placeholder/80/40" },
    { name: "Macam", logo: "/api/placeholder/80/40" },
    { name: "Mom's Bloom", logo: "/api/placeholder/80/40" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      {/* Hero Section */}
      <section className="px-6 py-12 max-w-6xl mx-auto text-center">
        {/* Rating Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-green-500 fill-green-500" />
            ))}
          </div>
          <span className="text-sm text-gray-600">Rated 5/5</span>
          <span className="text-sm text-gray-600">Used by 1700+ brands</span>
          <span className="text-sm text-gray-600">Full commercial rights</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-black mb-4 leading-tight">
          Instant Product Shoots
        </h1>
        <h2 className="text-5xl md:text-7xl font-bold text-orange-500 mb-4 leading-tight">
          Photos, Videos, And Ads
        </h2>
        <h3 className="text-5xl md:text-7xl font-bold text-black mb-8 leading-tight">
          From A Single Upload.
        </h3>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Upload a picture, pick your styles, and get 100+ on-brand assets in
          minutes. No studio, no expensive models!
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <Button
            asChild
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-lg"
          >
            <Link href="/home">Get Started For Free →</Link>
          </Button>
          <Button
            variant="outline"
            className="px-8 py-3 text-lg border-gray-300 hover:bg-gray-50"
          >
            <UserIcon className="h-5 w-5 mr-2" />
            Book a Demo
          </Button>
        </div>

        {/* Product Gallery */}
        {/* Product Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-3 mb-16">
          {productImages.map((image, index) => (
            <div
              key={index}
              className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden shadow-sm"
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                {/* Simulated product images - you can replace with actual images */}
                <div className="w-full h-full bg-white rounded-lg mx-1 my-1 flex items-center justify-center">
                  <div className="text-2xl">👕</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Section */}
        <div className="text-center">
          <p className="text-gray-600 mb-8">
            Trusted by forward-thinking brands
          </p>
          <div className="flex items-center justify-center gap-8 opacity-60">
            {brandLogos.map((brand, index) => (
              <div
                key={index}
                className="h-10 w-20 bg-gray-200 rounded flex items-center justify-center"
              >
                <span className="text-xs text-gray-500">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
