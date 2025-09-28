"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface AuthHeaderProps {
  currentPage?: 'signin' | 'signup';
}

export function AuthHeader({ currentPage }: AuthHeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Heart className="h-6 w-6 text-orange-500 fill-orange-500" />
          <span className="text-xl font-bold text-black">
            DESIGNATOR
          </span>
        </div>
      </Link>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        <Link href="/signup">
          <Button 
            variant={currentPage === 'signup' ? 'default' : 'ghost'} 
            className={currentPage === 'signup' 
              ? "bg-orange-500 hover:bg-orange-600 text-white" 
              : "text-gray-700 hover:text-black"
            }
          >
            Signup
          </Button>
        </Link>
        <Link href="/signin">
          <Button 
            variant={currentPage === 'signin' ? 'default' : 'ghost'} 
            className={currentPage === 'signin' 
              ? "bg-orange-500 hover:bg-orange-600 text-white" 
              : "text-gray-700 hover:text-black"
            }
          >
            Signin
          </Button>
        </Link>
      </div>
    </header>
  );
}