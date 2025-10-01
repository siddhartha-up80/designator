"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  Mail,
  User as UserIcon,
  CreditCard,
  Crown,
} from "lucide-react";
import Image from "next/image";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    onOpenChange(false);
  };

  if (!session?.user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 px-6 pt-6 pb-20">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-semibold">
              Account
            </DialogTitle>
            <DialogDescription className="text-orange-100">
              Manage your profile and preferences
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Profile Avatar - Overlapping the gradient */}
        <div className="relative -mt-16 px-6">
          <div className="flex flex-col items-center">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={96}
                height={96}
                className="rounded-full border-4 border-white shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              {session.user.name || "User"}
            </h3>
            <Badge
              variant="secondary"
              className="mt-2 bg-orange-50 text-orange-700 border-orange-200"
            >
              <Crown className="w-3 h-3 mr-1" />
              Free Plan
            </Badge>
          </div>

          {/* User Information */}
          <div className="mt-6 space-y-3">
            {/* Email */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm text-gray-900 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>

            {/* User ID */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  User ID
                </p>
                <p className="text-xs text-gray-700 truncate font-mono">
                  {session.user.id}
                </p>
              </div>
            </div>

            {/* Credits */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Credits Remaining
                </p>
                <p className="text-lg font-bold text-orange-700">50 / 50</p>
              </div>
              <Button
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Buy More
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 pb-6 space-y-2">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
