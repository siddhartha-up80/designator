"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignUpPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Images for the carousel with model-product mapping
  const carouselImages = [
    {
      src: "/images/model1.png",
      alt: "Model 1 showcase",
      productSrc: "/images/product1.png",
      type: "model",
    },
    {
      src: "/images/model1_2.png",
      alt: "Model 1 variation 2",
      productSrc: "/images/product1.png",
      type: "model",
    },
    {
      src: "/images/model1_3.png",
      alt: "Model 1 variation 3",
      productSrc: "/images/product1.png",
      type: "model",
    },
    {
      src: "/images/model2.png",
      alt: "Model 2 showcase",
      productSrc: "/images/product2.png",
      type: "model",
    },
    {
      src: "/images/model5.png",
      alt: "Model 5 showcase",
      productSrc: "/images/product5.png",
      type: "model",
    },
    {
      src: "/images/model6.png",
      alt: "Model 6 showcase",
      productSrc: "/images/product3.png",
      type: "model",
    },
    {
      src: "/images/model7.png",
      alt: "Model 7 showcase",
      productSrc: "/images/product3.png",
      type: "model",
    },
    {
      src: "/images/product1.png",
      alt: "Product 1",
      productSrc: "/images/product1.png",
      type: "product",
    },
    {
      src: "/images/product2.png",
      alt: "Product 2",
      productSrc: "/images/product2.png",
      type: "product",
    },
    {
      src: "/images/product3.png",
      alt: "Product 3",
      productSrc: "/images/product3.png",
      type: "product",
    },
    {
      src: "/images/product5.png",
      alt: "Product 5",
      productSrc: "/images/product5.png",
      type: "product",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup form submitted:", formData);
  };

  const handleGoogleSignUp = () => {
    // Handle Google signup logic here
    console.log("Google signup clicked");
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left side - Carousel */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-orange-100 via-orange-50 to-yellow-50">
        {/* Carousel container */}
        <div className="relative w-full h-full">
          {/* Main carousel image */}
          <div className="w-full h-full flex items-center justify-center p-8">
            <img
              src={carouselImages[currentSlide].src}
              alt={carouselImages[currentSlide].alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            aria-label="Previous image"
            className="absolute left-6 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-transparent backdrop-blur-xs border border-white/30 hover:border-orange-400 hover:bg-orange-500/10 transition-all duration-300 group cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-black group-hover:text-orange-500 transition-colors duration-300" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next image"
            className="absolute right-6 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-transparent backdrop-blur-xs border border-white/30 hover:border-orange-400 hover:bg-orange-500/10 transition-all duration-300 group cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-black group-hover:text-orange-500 transition-colors duration-300" />
          </button>

          {/* Thumbnail navigation */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              {carouselImages.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "bg-orange-500 scale-110"
                      : "bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail preview in bottom left */}
          <div className="absolute bottom-6 left-6">
            <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-lg">
              <img
                src={carouselImages[currentSlide].productSrc}
                alt={`Product for ${carouselImages[currentSlide].alt}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8 overflow-y-auto">
        <div className="w-full max-w-md my-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-orange-500 mb-2">Sign Up</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              Sign Up
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Sign Up Button */}
          <Button
            type="button"
            onClick={handleGoogleSignUp}
            variant="outline"
            className="w-full py-3 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
            </span>
            <a
              href="/signin"
              className="text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
