"use client";
import React, { useState, useEffect } from "react";
import {
  Sidebar as AceternitySidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
import { ProfileDialog } from "@/components/profile-dialog";
import Image from "next/image";

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
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

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
            {session?.user ? (
              <div
                onClick={() => setProfileDialogOpen(true)}
                className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors group"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={28}
                    height={28}
                    className="rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
                {open && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate">
                      {session.user.name?.split(" ")[0] || "Profile"}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      View Profile
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <SidebarLink
                link={{
                  label: "User",
                  href: "/signin",
                  icon: (
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  ),
                }}
              />
            )}
          </div>
        </SidebarBody>
      </AceternitySidebar>
      <ProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      />
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
