"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useCredits } from "@/contexts/credits-context";
import { showToast } from "@/lib/toast";
import { useStatistics } from "@/hooks/use-statistics";
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
  // Other user preferences can be added here later
  // Theme is now handled by next-themes
}

const defaultPreferences: UserPreferences = {};

const QuickStats: React.FC = () => {
  const { statistics, loading, error } = useStatistics();

  if (loading) {
    return (
      <div className="space-y-2 sm:space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between animate-pulse"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 bg-muted rounded"></div>
              <div className="h-3.5 w-16 sm:w-20 bg-muted rounded"></div>
            </div>
            <div className="h-3.5 w-6 sm:w-8 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-3 sm:py-4">
        <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
          Failed to load statistics
        </p>
        <p className="text-[10px] sm:text-xs text-red-500">{error}</p>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="text-center text-muted-foreground py-3 sm:py-4 text-xs sm:text-sm">
        No statistics available
      </div>
    );
  }

  const stats = [
    {
      label: "Images Generated",
      value: statistics.overview.totalImages.toString(),
      icon: FileImage,
    },
    {
      label: "Prompts Created",
      value: statistics.usage.promptsCreated.toString(),
      icon: Wand2,
    },
    {
      label: "Photos Enhanced",
      value: statistics.usage.photosEnhanced.toString(),
      icon: Sparkles,
    },
    {
      label: "Account Age",
      value: statistics.overview.accountAge,
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-2 sm:space-y-3">
      {stats.map(({ label, value, icon: Icon }, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">{label}</span>
          </div>
          <span className="font-semibold text-xs sm:text-sm flex-shrink-0">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const { credits, loading: creditsLoading } = useCredits();
  const { theme, setTheme } = useTheme();
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary flex-shrink-0" />
              <span className="truncate">Settings</span>
            </h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-xs sm:text-sm">
              <span className="hidden sm:inline">
                Manage your account preferences and application settings
              </span>
              <span className="sm:hidden">Manage account & app settings</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="truncate">Profile Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-5 md:space-y-6 p-3 sm:p-4 md:p-6 pt-0">
              {/* Profile Picture */}
              <div className="flex items-center gap-3 sm:gap-4">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Profile"}
                    width={64}
                    height={64}
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-border flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm sm:text-base truncate">
                    {session.user.name || "User"}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="displayName" className="text-xs sm:text-sm">
                    Display Name
                  </Label>{" "}
                  <span className="text-xs sm:text-sm truncate block">
                    {session.user.name || "User"}
                  </span>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="text-xs sm:text-sm">
                    Email Address
                  </Label>
                  <div className="text-foreground text-xs sm:text-sm truncate">
                    {session.user.email}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="truncate">Appearance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 pt-0">
              {/* Theme */}
              <div className="space-y-2 sm:space-y-3">
                <Label className="text-xs sm:text-sm">Theme</Label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { value: "light", label: "Light", icon: Sun },
                    { value: "dark", label: "Dark", icon: Moon },
                    { value: "system", label: "System", icon: Monitor },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className={`p-2 sm:p-3 rounded-lg border-2 transition-all hover:bg-muted ${
                        theme === value
                          ? "border-primary bg-primary/10"
                          : "border-border"
                      }`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-0.5 sm:mb-1" />
                      <div className="text-xs sm:text-sm font-medium">
                        {label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="text-sm sm:text-base md:text-lg">
                Help & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-3 sm:p-4 md:p-6 pt-0">
              <Button
                variant="outline"
                className="flex-1 justify-start text-xs sm:text-sm h-9 sm:h-10"
              >
                <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="truncate">Documentation</span>
                <ExternalLink className="h-3 w-3 ml-auto flex-shrink-0" />
              </Button>
              <Button
                variant="outline"
                className="flex-1 justify-start text-xs sm:text-sm h-9 sm:h-10"
              >
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="truncate">Contact Support</span>
                <ExternalLink className="h-3 w-3 ml-auto flex-shrink-0" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* Account Overview */}
          <Card>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg">
                <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="truncate">Account Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 pt-0">
              <div className="text-center">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Profile"}
                    width={80}
                    height={80}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto border-2 sm:border-4 border-primary/20"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto">
                    <User className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
                  </div>
                )}
                <h3 className="font-semibold text-base sm:text-lg mt-2 sm:mt-3 truncate px-2">
                  {session.user.name || "User"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground truncate px-2">
                  {session.user.email}
                </p>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs font-medium text-primary">
                      Credits Remaining
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-primary truncate">
                      {creditsLoading ? "..." : credits || 0}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => router.push("/buy-credits")}
                    className="bg-primary hover:bg-primary/90 h-8 sm:h-9 text-xs sm:text-sm flex-shrink-0"
                  >
                    <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Buy More</span>
                    <span className="sm:hidden">Buy</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="text-sm sm:text-base md:text-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="truncate">Usage Statistics</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/statistics")}
                  className="h-7 sm:h-8 text-xs sm:text-sm self-start sm:self-auto"
                >
                  <span className="hidden sm:inline">
                    View Detailed Analytics
                  </span>
                  <span className="sm:hidden">View Details</span>
                  <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
              <QuickStats />
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
                <p className="text-[10px] sm:text-xs text-muted-foreground text-center leading-relaxed">
                  <span className="hidden sm:inline">
                    Get comprehensive insights including usage patterns,
                    efficiency metrics, and personalized recommendations in the
                    detailed analytics view.
                  </span>
                  <span className="sm:hidden">
                    View detailed insights, efficiency metrics &
                    recommendations.
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
