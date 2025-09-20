"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ImageIcon, DownloadIcon, Settings, MessageSquare } from "lucide-react";

const steps = [
  {
    id: "input",
    title: "Input",
    description: "Upload your product info",
    icon: Settings,
  },
  {
    id: "prompts",
    title: "Enhanced Prompt",
    description: "AI-generated prompts",
    icon: MessageSquare,
  },
  {
    id: "images",
    title: "Images",
    description: "Generated model images",
    icon: ImageIcon,
  },
  {
    id: "output",
    title: "Output",
    description: "Final generated content",
    icon: DownloadIcon,
  },
];

interface WorkflowStepsProps {
  activeStep: string;
  onStepClick?: (stepId: string) => void;
  isFirstStepCompleted?: boolean;
}

export function WorkflowSteps({
  activeStep,
  onStepClick,
  isFirstStepCompleted = false,
}: WorkflowStepsProps) {
  return (
    <div className="flex gap-4 mb-8">
      {steps.map((step, index) => {
        const isActive = step.id === activeStep;
        const isDisabled = step.id !== "input" && !isFirstStepCompleted;
        const isClickable =
          onStepClick && step.id !== activeStep && !isDisabled;

        return (
          <Card
            key={step.id}
            className={cn(
              "flex-1 p-4 transition-all duration-200",
              isActive
                ? "border-primary bg-orange-50"
                : isDisabled
                ? "border-gray-200 bg-gray-50 opacity-50"
                : "border-border hover:border-primary/50 hover:shadow-md",
              isClickable ? "cursor-pointer" : "cursor-default"
            )}
            onClick={() => isClickable && onStepClick(step.id)}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  isActive
                    ? "bg-primary/15"
                    : isDisabled
                    ? "bg-gray-200"
                    : "bg-muted"
                )}
              >
                <step.icon
                  className={cn(
                    "h-5 w-5",
                    isActive
                      ? "text-primary"
                      : isDisabled
                      ? "text-gray-400"
                      : "text-muted-foreground"
                  )}
                />
              </div>
              <div className="flex-1">
                <h3
                  className={cn(
                    "font-semibold text-sm",
                    isActive
                      ? "text-orange-700"
                      : isDisabled
                      ? "text-gray-400"
                      : "text-foreground"
                  )}
                >
                  {step.title}
                </h3>
                <p
                  className={cn(
                    "text-xs",
                    isActive
                      ? "text-orange-600"
                      : isDisabled
                      ? "text-gray-400"
                      : "text-muted-foreground"
                  )}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
