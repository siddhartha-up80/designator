"use client";

import { useState } from "react";
import { WorkflowSteps } from "@/components/workflow-steps";
import { AutomationForm } from "@/components/automation-form";

export default function AutomationPage() {
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
        {/* Workflow Steps */}
        <WorkflowSteps
          activeStep={activeStep}
          onStepClick={handleStepClick}
          isFirstStepCompleted={isFirstStepCompleted}
        />

        {/* Automation Form */}
        <AutomationForm
          activeStep={activeStep}
          onStepChange={setActiveStep}
          onUploadComplete={handleUploadComplete}
        />
      </div>
    </div>
  );
}
