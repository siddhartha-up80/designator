"use client";

import { Coins } from "lucide-react";

interface CostPreviewProps {
  baseRate: number;
  quantity: number;
  className?: string;
}

export function CostPreview({
  baseRate,
  quantity,
  className = "",
}: CostPreviewProps) {
  const totalCost = baseRate * quantity;

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <Coins className="w-4 h-4" />
      <span className="font-medium">{totalCost}</span>
    </span>
  );
}
