"use client";

import { useState } from "react";
import { WorkflowSteps } from "@/components/workflow-steps";
import { ProductModelForm } from "@/components/product-model-form";
import { FeatureCreditCost } from "@/components/credits-badge";
import { CREDIT_COSTS } from "@/lib/credits-service";
import { Package } from "lucide-react";

export default function ProductModelPage() {
  const [activeStep, setActiveStep] = useState("input");
  const [isFirstStepCompleted, setIsFirstStepCompleted] = useState(false);

  const handleUploadComplete = (uploadedImageUrl: string) => {
    setIsFirstStepCompleted(!!uploadedImageUrl);
  };

  const handleStepClick = (stepId: string) => {
    // Only allow navigation to other steps if first step is completed or clicking on input step
    if (stepId === "input" || isFirstStepCompleted) {
      setActiveStep(stepId);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Product Model Generator
            <FeatureCreditCost cost={CREDIT_COSTS.PHOTO_GENERATION} size="md" />
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Generate professional model images wearing your products
          </p>
        </div>

        {/* Workflow Steps */}
        <WorkflowSteps
          activeStep={activeStep}
          onStepClick={handleStepClick}
          isFirstStepCompleted={isFirstStepCompleted}
        />

        {/* Product Model Form */}
        <ProductModelForm
          activeStep={activeStep}
          onStepChange={setActiveStep}
          onUploadComplete={handleUploadComplete}
        />
      </div>
    </div>
  );
}
