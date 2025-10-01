"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, BookOpen, TrendingUp, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="flex items-center justify-end px-6 py-4 bg-background border-b border-border">
      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Help */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" />
          Help
        </Button>

        {/* Tutorial */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <BookOpen className="h-4 w-4" />
          Tutorial
        </Button>

        {/* Credits */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Credit</span>
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-800 hover:bg-orange-100"
          >
            50 / 50
          </Badge>
        </div>

        {/* Upgrade Button */}
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <TrendingUp className="h-4 w-4" />
          Upgrade
        </Button>

        {/* User Profile Dropdown */}
        {session?.user && (
          <div className="flex items-center gap-2 border-l pl-4 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => router.push("/profile")}
            >
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <User className="h-4 w-4" />
              )}
              <span className="text-sm">
                {session.user.name?.split(" ")[0] || "Profile"}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
