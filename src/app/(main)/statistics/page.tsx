"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3 } from "lucide-react";
import UsageStatistics from "@/components/usage-statistics";

export default function StatisticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check authentication
  React.useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              <BarChart3 className="h-7 w-7 text-primary" />
              Usage Statistics
            </h1>
            <p className="text-muted-foreground mt-2">
              Detailed insights into your Designator usage patterns and
              performance
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Content */}
      <UsageStatistics />
    </div>
  );
}
