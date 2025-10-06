"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Heart className="h-6 w-6 text-primary fill-primary" />
          <span className="text-xl font-bold text-foreground">
            DESIGNATOR <span className="font-normal">AI</span>
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <Link
          href="/gallery"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Gallery
        </Link>
        <Link
          href="/buy-credits"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Credits
        </Link>
        <div className="relative">
          <button className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
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
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            Sign In
          </Button>
        </Link>
        <Link href="/signup">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Sign Up
          </Button>
        </Link>
      </div>
    </header>
  );
}
