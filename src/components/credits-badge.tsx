"use client";

import { Coins } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface CreditsBadgeProps {
  credits: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

export function CreditsBadge({
  credits,
  size = "md",
  className,
  showLabel = false,
}: CreditsBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <Badge
      variant="secondary"
      className={cn(
        "gap-1.5 font-medium bg-orange-500 text-white border-orange-600 hover:bg-orange-600",
        sizeClasses[size],
        className
      )}
    >
      <Coins size={iconSizes[size]} className="text-white" />
      <span>
        {showLabel && "Credits: "}
        {credits === -1 ? "∞" : credits.toLocaleString()}
      </span>
    </Badge>
  );
}

interface FeatureCreditCostProps {
  cost: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FeatureCreditCost({
  cost,
  size = "sm",
  className,
}: FeatureCreditCostProps) {
  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-0.5",
    lg: "text-sm px-2.5 py-1",
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-semibold bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20",
        sizeClasses[size],
        className
      )}
    >
      <Coins size={iconSizes[size]} className="text-primary" />
      <span>{cost}</span>
    </Badge>
  );
}
