import { Metadata } from "next";
import { generateSEOMetadata, seoPages } from "@/lib/seo-config";

export const metadata: Metadata = generateSEOMetadata({
  title: seoPages.fashionTryOn.title,
  description: seoPages.fashionTryOn.description,
  keywords: seoPages.fashionTryOn.keywords,
  canonical: "https://designator.siddharthasingh.co.in/fashion-try-on",
});
