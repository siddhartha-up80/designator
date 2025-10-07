"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4 bg-background">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <img
          src="/designator.png"
          alt="Designator - AI Fashion Model Generator"
          className="h-10 w-auto max-w-[180px]"
        />
      </Link>

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
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Sign Up
          </Button>
        </Link>
      </div>
    </header>
  );
}
