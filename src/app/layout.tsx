import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { ConditionalLayout } from "@/components/conditional-layout";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Designator - AI Fashion Model Generator",
  description: "Generate stunning model images wearing your product designs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <EdgeStoreProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </EdgeStoreProvider>
      </body>
    </html>
  );
}
