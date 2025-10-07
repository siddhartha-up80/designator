"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!session) {
    router.push("/signin");
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Your Profile</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your account information
          </p>
        </div>

        <Card className="p-8">
          <div className="flex items-center space-x-6 mb-8">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={96}
                height={96}
                className="rounded-full"
              />
            ) : (
              <div className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {session.user.name || "User"}
              </h2>
              <p className="text-gray-600">{session.user.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Name</h3>
              <p className="mt-1 text-sm text-gray-900">
                {session.user.name || "Not provided"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">Email</h3>
              <p className="mt-1 text-sm text-gray-900">{session.user.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">User ID</h3>
              <p className="mt-1 text-xs text-gray-900 font-mono">
                {session.user.id}
              </p>
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <Button
              onClick={() => router.push("/home")}
              variant="outline"
              className="flex-1"
            >
              Back to Home
            </Button>
            <Button
              onClick={handleSignOut}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
