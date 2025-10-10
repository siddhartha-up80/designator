import { Metadata } from "next";

interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  canonical?: string;
}

export function generateSEOMetadata({
  title,
  description,
  keywords,
  image = "/images/og-image.jpg",
  canonical,
}: SEOConfig): Metadata {
  const baseUrl = "https://designator.siddharthasingh.co.in"; // Replace with your actual domain

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
      siteName: "Designator",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: canonical || baseUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const seoPages = {
  fashionTryOn: {
    title: "AI Fashion Try-On | Virtual Clothing Visualization | Designator",
    description:
      "Advanced AI fashion try-on technology. Visualize how clothing looks on models instantly. Perfect for fashion brands, designers, and e-commerce.",
    keywords: [
      "AI fashion try-on",
      "virtual try-on",
      "clothing visualization",
      "fashion AI",
      "virtual fitting",
      "fashion technology",
      "digital try-on",
      "AI clothing models",
      "fashion visualization",
      "virtual wardrobe",
    ],
    canonical: "/fashion-try-on",
  },

  productModel: {
    title: "AI Product Model Generator | Fashion Photography | Designator",
    description:
      "Generate professional product model photos instantly with AI. Create stunning fashion photography for your products without expensive photoshoots.",
    keywords: [
      "AI product models",
      "fashion photography AI",
      "product photography",
      "AI model generator",
      "fashion product photos",
      "digital models",
      "AI fashion photography",
      "product visualization",
      "virtual models",
      "AI photo generation",
    ],
    canonical: "/product-model",
  },

  promptToImage: {
    title: "AI Image Generator | Text to Fashion Image | Designator",
    description:
      "Transform text prompts into stunning fashion images with AI. Create unique fashion designs and concepts from simple descriptions.",
    keywords: [
      "AI image generator",
      "text to image",
      "fashion AI art",
      "AI fashion design",
      "prompt to image",
      "fashion concept art",
      "AI design generator",
      "fashion AI tools",
      "creative AI",
      "fashion illustration AI",
    ],
    canonical: "/prompt-to-image",
  },

  photography: {
    title: "AI Fashion Photography | Professional Model Photos | Designator",
    description:
      "Create professional fashion photography with AI. Generate high-quality model photos for your fashion brand or portfolio.",
    keywords: [
      "AI fashion photography",
      "professional model photos",
      "fashion photo AI",
      "AI photographer",
      "digital fashion photography",
      "fashion portrait AI",
      "model photography AI",
      "fashion photo generator",
      "AI photo studio",
      "virtual fashion photography",
    ],
    canonical: "/photography",
  },

  gallery: {
    title: "AI Fashion Gallery | Model Photo Showcase | Designator",
    description:
      "Explore stunning AI-generated fashion model photos. Get inspiration from our gallery of AI fashion photography and designs.",
    keywords: [
      "AI fashion gallery",
      "fashion model photos",
      "AI generated fashion",
      "fashion inspiration",
      "model photo gallery",
      "AI fashion showcase",
      "digital fashion art",
      "fashion AI examples",
      "virtual fashion gallery",
      "AI fashion portfolio",
    ],
    canonical: "/gallery",
  },
};
