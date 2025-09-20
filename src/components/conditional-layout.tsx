"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar-main";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Landing page route - no sidebar/header
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    // Landing page layout - full screen, no sidebar/header
    return <div className="min-h-screen">{children}</div>;
  }

  // All other routes get the app layout with sidebar and header
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto pt-16 md:pt-0">{children}</main>
      </div>
    </div>
  );
}
