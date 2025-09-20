"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home,
  ImageIcon,
  Sparkles,
  Camera,
  Shirt,
  Video,
  ArrowUpCircle,
  FileImage,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const sidebarItems = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: ImageIcon, label: "Gallery", href: "/gallery" },
  { icon: Sparkles, label: "Automation", href: "/automation" },
  { icon: Camera, label: "Photography", href: "/photography" },
  { icon: Shirt, label: "Fashion Try On", href: "/fashion-try-on" },
  { icon: Video, label: "Video", href: "/video" },
  { icon: ArrowUpCircle, label: "Upscale", href: "/upscale" },
  { icon: FileImage, label: "Img to Prompt", href: "/img-to-prompt" },
  { icon: DollarSign, label: "Pricing", href: "/pricing" },
];

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-muted"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Button
              key={item.href}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-10",
                isActive &&
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                !isActive &&
                  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isCollapsed && "px-2"
              )}
              onClick={() => handleNavigation(item.href)}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-sidebar-foreground truncate">
                User
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
