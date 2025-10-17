import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar-main";
import { Header } from "@/components/header";
import { CreditsProvider } from "@/contexts/credits-context";

export const metadata: Metadata = {
  title: "Designator - AI Fashion Model Generator",
  description: "Generate stunning model images wearing your product designs",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CreditsProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto pt-0 md:pt-2">{children}</main>
        </div>
      </div>
    </CreditsProvider>
  );
}
