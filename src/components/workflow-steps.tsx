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
                ? "border-primary bg-primary/10"
                : isDisabled
                ? "border-muted bg-muted opacity-50"
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
                    ? "bg-muted"
                    : "bg-muted"
                )}
              >
                <step.icon
                  className={cn(
                    "h-5 w-5",
                    isActive
                      ? "text-primary"
                      : isDisabled
                      ? "text-muted-foreground"
                      : "text-muted-foreground"
                  )}
                />
              </div>
              <div className="flex-1">
                <h3
                  className={cn(
                    "font-semibold text-sm",
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
                    "text-xs",
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
