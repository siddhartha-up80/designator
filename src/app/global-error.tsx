"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              
              <h1 className="text-6xl font-bold text-red-500 mb-4">500</h1>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Critical Error
              </h2>
              <p className="text-gray-600 mb-8">
                A critical error occurred. Please try refreshing the page.
              </p>
              
              {error.digest && (
                <p className="text-xs text-gray-400 mb-4 font-mono bg-gray-100 p-2 rounded">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <Button onClick={reset} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = "/"}
              >
                Go to Home
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                If this problem persists, please contact us at{" "}
                <a
                  href="mailto:siddharthasingh.work@gmail.com"
                  className="text-rose-600 hover:text-rose-500"
                >
                  siddharthasingh.work@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}