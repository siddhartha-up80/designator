"use client";
import React, { useState, useEffect } from "react";
import {
  Sidebar as AceternitySidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Home,
  ImageIcon,
  Sparkles,
  Camera,
  Shirt,
  FileImage,
  Wand2,
  DollarSign,
  User,
  Pin,
  PinOff,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const sidebarItems = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: ImageIcon, label: "Gallery", href: "/gallery" },
  { icon: Sparkles, label: "Product Model", href: "/product-model" },
  { icon: Wand2, label: "Prompt to Image", href: "/prompt-to-image" },
  { icon: FileImage, label: "Img to Prompt", href: "/img-to-prompt" },
  { icon: Camera, label: "Photography", href: "/photography" },
  { icon: Shirt, label: "Fashion Try On", href: "/fashion-try-on" },
  { icon: DollarSign, label: "Pricing", href: "/pricing" },
];

export function Sidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(true); // Default to open for better initial UX
  const [pinned, setPinned] = useState(true); // Default to pinned for desktop
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);

      // Immediately set mobile states
      if (mobile) {
        setPinned(false);
        setOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Load pinned state from localStorage on mount (desktop only)
  useEffect(() => {
    if (!isMobile) {
      const savedPinned = localStorage.getItem("sidebar-pinned");
      const savedOpen = localStorage.getItem("sidebar-open");

      if (savedPinned !== null) {
        const isPinned = savedPinned === "true";
        setPinned(isPinned);

        if (savedOpen !== null) {
          setOpen(savedOpen === "true");
        } else {
          setOpen(isPinned); // Open if pinned by default
        }
      }
      // If no saved state, keep the defaults (pinned: true, open: true)
    }
  }, [isMobile]);

  // Save both pinned and open state to localStorage (desktop only)
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("sidebar-pinned", pinned.toString());
    }
  }, [pinned, isMobile]);

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("sidebar-open", open.toString());
    }
  }, [open, isMobile]);

  // Override setOpen to respect pinned state (desktop only)
  const handleSetOpen = (value: React.SetStateAction<boolean>) => {
    if (isMobile || !pinned) {
      setOpen(value);
    }
  };

  const togglePin = () => {
    if (!isMobile) {
      setPinned(!pinned);
      if (!pinned) {
        setOpen(true); // Open sidebar when pinning
      }
    }
  };

  const links = sidebarItems.map((item) => ({
    label: item.label,
    href: item.href,
    icon: (
      <item.icon className="h-5 w-5 shrink-0 text-orange-500 dark:text-orange-400" />
    ),
  }));

  return (
    <div className={cn(className, !isMobile && pinned && "relative")}>
      <AceternitySidebar open={open} setOpen={handleSetOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <div className="flex items-center justify-between">
              {open ? <Logo /> : <LogoIcon />}
              {open && !isMobile && (
                <button
                  onClick={togglePin}
                  className={cn(
                    "p-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors",
                    pinned && "bg-orange-50 dark:bg-orange-950"
                  )}
                  title={pinned ? "Unpin sidebar" : "Pin sidebar"}
                >
                  {pinned ? (
                    <Pin className="h-4 w-4 cursor-pointer text-orange-500" />
                  ) : (
                    <PinOff className="h-4 w-4 cursor-pointer text-neutral-500" />
                  )}
                </button>
              )}
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "User",
                href: "#",
                icon: (
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </AceternitySidebar>
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="/home"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
      title="Designator"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-gradient-to-br from-orange-400 to-orange-600" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Designator
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="/home"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
      title="Designator"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-gradient-to-br from-orange-400 to-orange-600" />
    </a>
  );
};
