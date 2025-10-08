"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
};
