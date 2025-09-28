"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Heart className="h-6 w-6 text-orange-500 fill-orange-500" />
          <span className="text-xl font-bold text-black">
            DESIGNATOR <span className="font-normal">AI</span>
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <Link
          href="/gallery"
          className="text-gray-700 hover:text-black transition-colors"
        >
          Gallery
        </Link>
        <Link
          href="/pricing"
          className="text-gray-700 hover:text-black transition-colors"
        >
          Pricing
        </Link>
        <div className="relative">
          <button className="text-gray-700 hover:text-black transition-colors flex items-center gap-1">
            Use Case
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        <Link href="/signin">
          <Button variant="ghost" className="text-gray-700 hover:text-black">
            Sign In
          </Button>
        </Link>
        <Link href="/signup">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Sign Up
          </Button>
        </Link>
      </div>
    </header>
  );
}
