"use client";

import { useEffect } from "react";

// Web Vitals tracking for Google PageSpeed Insights
export function WebVitals() {
  useEffect(() => {
    if ("web-vital" in window) return;

    const script = document.createElement("script");
    script.src = "https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js";
    script.onload = () => {
      // @ts-ignore
      if (window.webVitals) {
        // @ts-ignore
        webVitals.getCLS(sendToAnalytics);
        // @ts-ignore
        webVitals.getFID(sendToAnalytics);
        // @ts-ignore
        webVitals.getFCP(sendToAnalytics);
        // @ts-ignore
        webVitals.getLCP(sendToAnalytics);
        // @ts-ignore
        webVitals.getTTFB(sendToAnalytics);
      }
    };
    document.head.appendChild(script);

    // Mark as loaded
    // @ts-ignore
    window["web-vital"] = true;
  }, []);

  return null;
}

function sendToAnalytics(metric: any) {
  // Send to Google Analytics
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", metric.name, {
      event_category: "Web Vitals",
      value: Math.round(
        metric.name === "CLS" ? metric.value * 1000 : metric.value
      ),
      event_label: metric.id,
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("Web Vital:", metric);
  }
}

// Image optimization component
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  ...props
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  [key: string]: any;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${className} content-visibility-auto`}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...props}
    />
  );
}

// Preload critical resources
export function PreloadResources() {
  useEffect(() => {
    // Preload critical fonts
    const preloadFont = (href: string, type = "font/woff2") => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = href;
      link.as = "font";
      link.type = type;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    };

    // Preload Inter font (if using Google Fonts)
    preloadFont(
      "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
    );

    // DNS prefetch for external domains
    const dnsPrefetch = (domain: string) => {
      const link = document.createElement("link");
      link.rel = "dns-prefetch";
      link.href = domain;
      document.head.appendChild(link);
    };

    dnsPrefetch("https://fonts.googleapis.com");
    dnsPrefetch("https://fonts.gstatic.com");
    dnsPrefetch("https://www.googletagmanager.com");
    dnsPrefetch("https://images.unsplash.com");
    dnsPrefetch("https://images.pexels.com");
  }, []);

  return null;
}
