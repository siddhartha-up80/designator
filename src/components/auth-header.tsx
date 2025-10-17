"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AuthHeaderProps {
  currentPage?: "signin" | "signup";
}

export function AuthHeader({ currentPage }: AuthHeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 cursor-pointer bg-white dark:bg-rose-950 rounded-md px-1 py-0.5 touch-manipulation"
      >
        <img
          src="/designator.png"
          alt="Designator - AI Fashion Model Generator"
          className="h-8 md:h-10 w-auto max-w-[140px] md:max-w-[180px]"
        />
      </Link>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        <Link href="/signup" className="cursor-pointer touch-manipulation">
          <Button
            variant={currentPage === "signup" ? "default" : "ghost"}
            className={`text-xs md:text-sm px-3 md:px-4 py-2 min-h-[40px] md:min-h-[44px] ${
              currentPage === "signup"
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Signup
          </Button>
        </Link>
        <Link href="/signin" className="cursor-pointer touch-manipulation">
          <Button
            variant={currentPage === "signin" ? "default" : "ghost"}
            className={`text-xs md:text-sm px-3 md:px-4 py-2 min-h-[40px] md:min-h-[44px] ${
              currentPage === "signin"
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Signin
          </Button>
        </Link>
      </div>
    </header>
  );
}
