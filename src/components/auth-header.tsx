"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface AuthHeaderProps {
  currentPage?: "signin" | "signup";
}

export function AuthHeader({ currentPage }: AuthHeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <div className="flex items-center gap-1">
          <Heart className="h-6 w-6 text-primary fill-primary" />
          <span className="text-xl font-bold text-foreground">DESIGNATOR</span>
        </div>
      </Link>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        <Link href="/signup" className="cursor-pointer">
          <Button
            variant={currentPage === "signup" ? "default" : "ghost"}
            className={
              currentPage === "signup"
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Signup
          </Button>
        </Link>
        <Link href="/signin" className="cursor-pointer">
          <Button
            variant={currentPage === "signin" ? "default" : "ghost"}
            className={
              currentPage === "signin"
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Signin
          </Button>
        </Link>
      </div>
    </header>
  );
}
