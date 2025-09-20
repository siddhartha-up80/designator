"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, BookOpen, TrendingUp } from "lucide-react";

export function Header() {
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
      </div>
    </header>
  );
}
