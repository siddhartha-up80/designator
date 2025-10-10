"use client";

import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  );
}

// Event tracking functions
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific tracking functions for Designator
export const trackImageGeneration = (feature: string, credits_used: number) => {
  trackEvent("image_generated", "ai_generation", feature, credits_used);
};

export const trackCreditPurchase = (
  package_type: string,
  credits: number,
  amount: number
) => {
  trackEvent("purchase", "credits", package_type, amount);
};

export const trackUserSignup = (method: string) => {
  trackEvent("sign_up", "user_acquisition", method);
};

export const trackFeatureUsage = (feature: string) => {
  trackEvent("feature_used", "engagement", feature);
};

// Declare gtag function type for TypeScript
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: {
        page_title?: string;
        page_location?: string;
        event_category?: string;
        event_label?: string;
        value?: number;
      }
    ) => void;
  }
}
