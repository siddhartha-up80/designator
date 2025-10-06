"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useCredits } from "@/contexts/credits-context";
import { showToast } from "@/lib/toast";
import {
  Settings,
  User,
  Palette,
  Monitor,
  Moon,
  Sun,
  Save,
  RefreshCw,
  Camera,
  FileImage,
  Wand2,
  Sparkles,
  Mail,
  Globe,
  ExternalLink,
  Info,
  Crown,
  Calendar,
  CreditCard,
} from "lucide-react";
import Image from "next/image";

interface UserPreferences {
  theme: "light" | "dark" | "system";
}

const defaultPreferences: UserPreferences = {
  theme: "system",
};

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const { credits, loading: creditsLoading } = useCredits();
  const router = useRouter();
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Check authentication
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
      return;
    }
  }, [session, status, router]);

  // Load user preferences (simulate API call)
  useEffect(() => {
    const loadPreferences = async () => {
      setLoading(true);
      try {
        // Simulate API call - in real app, load from database
        const saved = localStorage.getItem("user-preferences");
        if (saved) {
          setPreferences(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Failed to load preferences:", error);
        showToast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      loadPreferences();
    }
  }, [session]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);

    // Auto-save to localStorage (in real app, debounce API calls)
    try {
      localStorage.setItem("user-preferences", JSON.stringify(newPreferences));
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  };

  const saveAllSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem("user-preferences", JSON.stringify(preferences));
      showToast.success("Settings saved successfully");
    } catch (error) {
      showToast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <Settings className="h-7 w-7 text-orange-500" />
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your account preferences and application settings
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-orange-500" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Profile"}
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {session.user.name || "User"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {session.user.email}
                  </p>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>{" "}
                  <span>{session.user.name || "User"}</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="text-gray-700 dark:text-gray-300">
                    {session.user.email}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-orange-500" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme */}
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light", label: "Light", icon: Sun },
                    { value: "dark", label: "Dark", icon: Moon },
                    { value: "system", label: "System", icon: Monitor },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => updatePreferences({ theme: value as any })}
                      className={`p-3 rounded-lg border-2 transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        preferences.theme === value
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-950"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <Icon className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">{label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Help & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 flex gap-3">
              <Button variant="outline" className="grow justify-start">
                <Info className="h-4 w-4 mr-2" />
                Documentation
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
              <Button variant="outline" className="grow justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
              <Button variant="outline" className="grow justify-start">
                <Globe className="h-4 w-4 mr-2" />
                Community
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Crown className="h-5 w-5 text-orange-500" />
                Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Profile"}
                    width={80}
                    height={80}
                    className="rounded-full mx-auto border-4 border-orange-100 dark:border-orange-900"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto">
                    <User className="h-10 w-10 text-white" />
                  </div>
                )}
                <h3 className="font-semibold text-lg mt-3">
                  {session.user.name || "User"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {session.user.email}
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-orange-700 dark:text-orange-300">
                      Credits Remaining
                    </p>
                    <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                      {creditsLoading ? "..." : credits || 0}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => router.push("/buy-credits")}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <CreditCard className="h-4 w-4 mr-1" />
                    Buy More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Images Generated", value: "127", icon: FileImage },
                { label: "Prompts Created", value: "45", icon: Wand2 },
                { label: "Photos Enhanced", value: "32", icon: Sparkles },
                { label: "Account Age", value: "2 months", icon: Calendar },
              ].map(({ label, value, icon: Icon }, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{label}</span>
                  </div>
                  <span className="font-semibold text-sm">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
