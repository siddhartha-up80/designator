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
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8 overflow-x-auto">
      {steps.map((step, index) => {
        const isActive = step.id === activeStep;
        const isDisabled = step.id !== "input" && !isFirstStepCompleted;
        const isClickable =
          onStepClick && step.id !== activeStep && !isDisabled;

        return (
          <Card
            key={step.id}
            className={cn(
              "flex-1 min-w-[200px] sm:min-w-0 p-3 sm:p-4 transition-all duration-200",
              isActive
                ? "border-primary bg-primary/10"
                : isDisabled
                ? "border-muted bg-muted opacity-50"
                : "border-border hover:border-primary/50 hover:shadow-md",
              isClickable ? "cursor-pointer" : "cursor-default"
            )}
            onClick={() => isClickable && onStepClick(step.id)}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className={cn(
                  "p-1.5 sm:p-2 rounded-lg shrink-0",
                  isActive
                    ? "bg-primary/15"
                    : isDisabled
                    ? "bg-muted"
                    : "bg-muted"
                )}
              >
                <step.icon
                  className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5",
                    isActive
                      ? "text-primary"
                      : isDisabled
                      ? "text-muted-foreground"
                      : "text-muted-foreground"
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "font-semibold text-xs sm:text-sm truncate",
                    isActive
                      ? "text-primary"
                      : isDisabled
                      ? "text-muted-foreground"
                      : "text-foreground"
                  )}
                >
                  {step.title}
                </h3>
                <p
                  className={cn(
                    "text-[10px] sm:text-xs truncate",
                    isActive
                      ? "text-primary"
                      : isDisabled
                      ? "text-muted-foreground"
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
