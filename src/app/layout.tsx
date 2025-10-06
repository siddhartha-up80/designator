import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { SessionProvider } from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { DialogProvider } from "@/components/ui/dialog-provider";
import { Toaster } from "sonner";
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
    <html lang="en" suppressHydrationWarning>
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
