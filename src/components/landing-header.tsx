"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <img
            src="/designator.png"
            alt="Designator - AI Fashion Model Generator"
            className="h-10 w-auto max-w-[180px]"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="/buy-credits"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <Link href="/signin" className="cursor-pointer">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup" className="cursor-pointer">
            <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
