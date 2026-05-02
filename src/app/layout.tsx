import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { SessionProvider } from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { DialogProvider } from "@/components/ui/dialog-provider";
import { GoogleAnalytics } from "@/components/google-analytics";
import { WebVitals, PreloadResources } from "@/components/web-vitals";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://designator.siddharthasingh.co.in"), // Replace with your actual domain
  title: {
    default:
      "Designator - AI Fashion Model Generator | Virtual Try-On & Product Photography",
    template: "%s | Designator",
  },
  description:
    "Create stunning AI fashion models wearing your products instantly. Professional virtual try-on technology for brands, designers & marketers.",
  keywords: [
    "AI fashion models",
    "virtual try-on",
    "fashion photography",
    "AI model generator",
    "product visualization",
    "fashion design",
    "virtual models",
    "clothing visualization",
    "AI fashion photography",
    "digital fashion models",
    "fashion AI",
    "virtual fashion",
    "model photography AI",
    "fashion tech",
    "AI clothing models",
  ],
  authors: [{ name: "Designator" }],
  creator: "Designator",
  publisher: "Designator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://designator.siddharthasingh.co.in",
    siteName: "Designator",
    title:
      "Designator - AI Fashion Model Generator | Virtual Try-On & Product Photography",
    description:
      "Create stunning AI fashion models wearing your products instantly. Professional virtual try-on technology for brands, designers & marketers.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Designator - AI Fashion Model Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Designator - AI Fashion Model Generator | Virtual Try-On",
    description:
      "Create stunning AI fashion models wearing your products instantly. Professional virtual try-on technology for brands, designers & marketers.",
    images: ["/images/twitter-image.jpg"],
    creator: "@designator",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/dlogo.png",
    shortcut: "/dlogo.png",
    apple: "/dlogo.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://designator.siddharthasingh.co.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Designator",
    applicationCategory: "DesignApplication",
    applicationSubCategory: "Fashion Design",
    operatingSystem: "Web Browser",
    description:
      "AI-powered fashion model generator that creates stunning virtual try-on experiences for clothing and fashion products",
    url: "https://designator.siddharthasingh.co.in",
    author: {
      "@type": "Organization",
      name: "Designator",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "AI Fashion Model Generation",
      "Virtual Try-On Technology",
      "Product Visualization",
      "Fashion Photography AI",
      "Prompt to Image Generation",
    ],
    screenshot:
      "https://designator.siddharthasingh.co.in/images/screenshot-desktop.png",
    softwareVersion: "1.0",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <EdgeStoreProvider>
              <DialogProvider>
                {children}
                <GoogleAnalytics />
                <WebVitals />
                <PreloadResources />
                <Toaster
                  position="top-center"
                  richColors
                  closeButton
                  expand={false}
                />
              </DialogProvider>
            </EdgeStoreProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
