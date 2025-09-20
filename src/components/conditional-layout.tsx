"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Landing page route - no sidebar/header
  const isLandingPage = pathname === "/";

  // App routes that should have sidebar/header
  const isAppRoute =
    pathname.startsWith("/home") ||
    pathname.startsWith("/automation") ||
    pathname.startsWith("/gallery") ||
    pathname.startsWith("/photography") ||
    pathname.startsWith("/fashion-try-on") ||
    pathname.startsWith("/video") ||
    pathname.startsWith("/upscale") ||
    pathname.startsWith("/img-to-prompt") ||
    pathname.startsWith("/pricing");

  if (isLandingPage) {
    // Landing page layout - full screen, no sidebar/header
    return <div className="min-h-screen">{children}</div>;
  }

  if (isAppRoute) {
    // App layout - with sidebar and header
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    );
  }

  // Default layout for other routes
  return <div className="min-h-screen">{children}</div>;
}
