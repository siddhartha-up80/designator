"use client";

import { Button } from "@/components/ui/button";
import { CreditsBadge } from "@/components/credits-badge";
import { HelpCircle, BookOpen, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCredits } from "@/contexts/credits-context";

export function Header() {
  const router = useRouter();
  const { credits, loading } = useCredits();

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
          <span className="text-sm text-muted-foreground">Credits</span>
          {loading ? (
            <div className="h-6 w-16 bg-muted animate-pulse rounded" />
          ) : (
            <CreditsBadge credits={credits ?? 0} showLabel={false} />
          )}
        </div>

        {/* Upgrade Button (show only if credits <= 100) */}
        {!loading && (credits ?? 0) <= 100 && (
          <Button
            onClick={() => router.push("/buy-credits")}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Upgrade
          </Button>
        )}
      </div>
    </header>
  );
}
