"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Camera,
  Shirt,
  ArrowUpRight,
  ImageIcon,
  Settings,
  CreditCard,
  Image as ImageIconLucide,
  File,
  Triangle,
  ChevronRight,
  Wand2,
  MessageSquare,
  FileImage,
  Activity as ActivityIcon,
  Clock,
} from "lucide-react";
import { LoaderThree } from "@/components/ui/loader";
import { useCredits } from "@/contexts/credits-context";
import {
  useRecentActivities,
  type Activity,
} from "@/hooks/use-recent-activities";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { showToast } from "@/lib/toast";

const aiTools = [
  {
    id: "product-model",
    title: "Product Model Generation",
    description:
      "Generate professional product photos with AI models wearing your designs",
    icon: Sparkles,
    href: "/product-model",
    buttonText: "Generate",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    outputLabels: ["Model", "Product"],
    previewImage: "/images/product1.png",
  },
  {
    id: "ai-photography",
    title: "AI Photography",
    description:
      "Enhance and transform your product photos with professional AI photography",
    icon: Camera,
    href: "/photography",
    buttonText: "Enhance",
    iconBg: "bg-secondary/10",
    iconColor: "text-primary",
    previewImage: "/images/product2.png",
  },
  {
    id: "fashion-try-on",
    title: "Fashion Try On",
    description:
      "Let customers virtually try on your garments using AI technology",
    icon: Shirt,
    href: "/fashion-try-on",
    buttonText: "Try On",
    iconBg: "bg-accent/10",
    iconColor: "text-primary",
    previewImage: "/images/model1.png",
    modelImages: ["/images/model1_2.png", "/images/model1_3.png"],
  },
  {
    id: "gallery",
    title: "Creative Gallery",
    description:
      "Browse and manage your AI-generated fashion models and creative content",
    icon: ImageIconLucide,
    href: "/gallery",
    buttonText: "Browse",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
    previewImage: "/images/product3.png",
    isGallery: true,
  },
  {
    id: "prompt-to-image",
    title: "Prompt to Image",
    description:
      "Generate stunning fashion and product images from text descriptions",
    icon: Wand2,
    href: "/prompt-to-image",
    buttonText: "Generate",
    iconBg: "bg-secondary/15",
    iconColor: "text-primary",
    previewImage: "/images/product5.png",
  },
  {
    id: "img-to-prompt",
    title: "Image to Prompt",
    description:
      "Extract detailed prompts and descriptions from your existing images",
    icon: MessageSquare,
    href: "/img-to-prompt",
    buttonText: "Analyze",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    previewImage: "/images/model7.png",
  },
];

const quickAccessItems = [
  {
    icon: ImageIconLucide,
    title: "Gallery",
    href: "/gallery",
  },
  {
    icon: CreditCard,
    title: "Credits",
    href: "/buy-credits",
  },
  {
    icon: Settings,
    title: "Settings",
    href: "/settings",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { credits, loading: creditsLoading } = useCredits();
  const {
    activities,
    loading: activitiesLoading,
    refreshActivities,
  } = useRecentActivities(5);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Camera":
        return Camera;
      case "Wand2":
        return Wand2;
      case "Sparkles":
        return Sparkles;
      case "Shirt":
        return Shirt;
      case "ImageIcon":
        return ImageIconLucide;
      case "ActivityIcon":
        return ActivityIcon;

      default:
        return ActivityIcon;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  // Show low credit alert if credits are less than 20
  const showLowCreditAlert = credits !== null && credits < 20;

  // Function to clear recent activities
  const clearRecentActivities = async () => {
    try {
      const response = await fetch("/api/recent-activities/clear", {
        method: "DELETE",
      });
      if (response.ok) {
        const data = await response.json();
        await refreshActivities(); // Refresh the activities list
        showToast.success(
          "Recent activities cleared",
          `Deleted ${data.deleted.transactions} activities and ${data.deleted.images} images`
        );
      } else {
        throw new Error("Failed to clear activities");
      }
    } catch (error) {
      console.error("Error clearing recent activities:", error);
      showToast.error("Failed to clear activities", "Please try again later");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <p className="text-2xl mb-2 font-semibold text-foreground">
            Get Started with our AI Tools
          </p>
          <p className="text-base text-muted-foreground">
            Choose your preferred option to get started
          </p>
        </div>
        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {aiTools.map((tool, index) => {
            const gradientClasses = [
              "bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20",
              "bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20",
              "bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20",
              "bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20",
              "bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20",
              "bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20",
            ];

            const outputGradients = [
              "bg-gradient-to-br from-primary/20 via-primary/15 to-secondary/20",
              "bg-gradient-to-br from-primary/20 via-primary/15 to-secondary/20",
              "bg-gradient-to-br from-primary/20 via-primary/15 to-secondary/20",
              "bg-gradient-to-br from-primary/20 via-primary/15 to-secondary/20",
              "bg-gradient-to-br from-primary/20 via-primary/15 to-secondary/20",
              "bg-gradient-to-br from-primary/20 via-primary/15 to-secondary/20",
            ];

            const buttonColors = [
              "text-primary group-hover:text-primary/80",
              "text-primary group-hover:text-primary/80",
              "text-primary group-hover:text-primary/80",
              "text-primary group-hover:text-primary/80",
              "text-primary group-hover:text-primary/80",
              "text-primary group-hover:text-primary/80",
            ];

            const IconComponent = tool.icon;

            return (
              <div
                key={tool.id}
                className={`${gradientClasses[index]} rounded-3xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer`}
                onClick={() => router.push(tool.href)}
              >
                {/* Header with Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-3 shadow-sm">
                    <IconComponent className={`h-6 w-6 ${tool.iconColor}`} />
                  </div>
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {tool.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {tool.description}
                </p>

                {/* Output Section */}
                <div
                  className={`${outputGradients[index]} rounded-2xl p-6 mb-4 relative`}
                >
                  {/* Dynamic Content Based on Tool Type */}
                  {tool.id === "product-model" && (
                    <>
                      {/* Model and Product */}
                      <div className="flex justify-center gap-4 mt-8 mb-4">
                        <div className="w-16 h-24 bg-gradient-to-b from-pink-300 to-pink-500 rounded-2xl relative shadow-lg">
                          {/* Model figure */}
                          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-pink-400 rounded-full"></div>
                          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-10 h-12 bg-pink-400 rounded-t-xl"></div>
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-pink-400 rounded-b-xl"></div>
                        </div>
                        <div className="w-16 h-20 bg-gradient-to-b from-rose-600 to-rose-800 rounded-2xl shadow-lg relative overflow-hidden">
                          <div className="absolute inset-2 bg-gradient-to-b from-rose-400 to-rose-600 rounded-xl"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/30 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex justify-center gap-4">
                        <div className="bg-primary text-primary-foreground text-xs px-4 py-2 rounded-xl font-semibold shadow-sm">
                          Model
                        </div>
                        <div className="bg-primary text-primary-foreground text-xs px-4 py-2 rounded-xl font-semibold shadow-sm">
                          Product
                        </div>
                      </div>
                    </>
                  )}

                  {tool.id === "ai-photography" && (
                    <>
                      {/* Camera/Photo Enhancement */}
                      <div className="flex justify-center mt-8 mb-4">
                        <div className="w-20 h-16 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-lg relative overflow-hidden">
                          <div className="absolute inset-2 bg-gradient-to-b from-gray-700 to-gray-800 rounded-xl"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full border-2 border-border flex items-center justify-center">
                            <div className="w-1 h-3 bg-muted-foreground rounded"></div>
                            <div className="w-3 h-1 bg-muted-foreground absolute rounded"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="bg-primary text-primary-foreground text-xs px-4 py-2 rounded-xl font-semibold shadow-sm">
                          Enhanced
                        </div>
                      </div>
                    </>
                  )}

                  {tool.id === "fashion-try-on" && (
                    <>
                      {/* Model with clothing options */}
                      <div className="flex justify-center mt-8 mb-4">
                        <div className="w-16 h-24 bg-gradient-to-b from-pink-300 to-pink-500 rounded-2xl relative shadow-lg">
                          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-pink-400 rounded-full"></div>
                          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-10 h-12 bg-pink-400 rounded-t-xl"></div>
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-pink-400 rounded-b-xl"></div>
                        </div>
                      </div>
                      <div className="flex justify-center gap-2">
                        <div className="w-6 h-6 bg-rose-400 rounded-lg shadow-sm"></div>
                        <div className="w-6 h-6 bg-pink-400 rounded-lg shadow-sm"></div>
                        <div className="w-6 h-6 bg-rose-500 rounded-lg shadow-sm"></div>
                      </div>
                    </>
                  )}

                  {tool.id === "gallery" && (
                    <>
                      {/* Gallery grid preview */}
                      <div className="flex justify-center mt-8 mb-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="w-8 h-10 bg-gradient-to-b from-rose-400 to-rose-600 rounded-lg shadow-sm"></div>
                          <div className="w-8 h-10 bg-gradient-to-b from-pink-400 to-pink-600 rounded-lg shadow-sm"></div>
                          <div className="w-8 h-10 bg-gradient-to-b from-rose-300 to-rose-500 rounded-lg shadow-sm"></div>
                          <div className="w-8 h-10 bg-gradient-to-b from-pink-300 to-pink-500 rounded-lg shadow-sm"></div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="bg-primary text-primary-foreground text-xs px-4 py-2 rounded-xl font-semibold shadow-sm">
                          Gallery
                        </div>
                      </div>
                    </>
                  )}

                  {tool.id === "prompt-to-image" && (
                    <>
                      {/* Text to image concept */}
                      <div className="flex justify-center items-center gap-3 mt-8 mb-4">
                        <div className="w-12 h-8 bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-xs text-muted-foreground font-mono">
                            ABC
                          </div>
                        </div>
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <ChevronRight className="h-2 w-2 text-primary-foreground" />
                        </div>
                        <div className="w-12 h-8 bg-gradient-to-b from-rose-400 to-rose-600 rounded-lg"></div>
                      </div>
                      <div className="flex justify-center">
                        <div className="bg-primary text-primary-foreground text-xs px-4 py-2 rounded-xl font-semibold shadow-sm">
                          Generated
                        </div>
                      </div>
                    </>
                  )}

                  {tool.id === "img-to-prompt" && (
                    <>
                      {/* Image to text concept */}
                      <div className="flex justify-center items-center gap-3 mt-8 mb-4">
                        <div className="w-12 h-8 bg-gradient-to-b from-rose-400 to-rose-600 rounded-lg"></div>
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <ChevronRight className="h-2 w-2 text-primary-foreground" />
                        </div>
                        <div className="w-12 h-8 bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-xs text-muted-foreground font-mono">
                            TXT
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="bg-primary text-primary-foreground text-xs px-4 py-2 rounded-xl font-semibold shadow-sm">
                          Description
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Button */}
                <div
                  className={`flex items-center ${buttonColors[index]} font-semibold text-lg`}
                >
                  <span>{tool.buttonText}</span>
                  <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-card rounded-3xl p-6 sm:p-8 border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
              <h2 className="text-2xl font-semibold text-card-foreground">
                Recent Activity
              </h2>
              <div className="flex gap-2">
                {activities.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-red-600 border-muted hover:border-red-200"
                      >
                        Clear All
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Clear Recent Activities
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all your recent
                          activities, including credit transactions and
                          generated images from your gallery. This action cannot
                          be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={clearRecentActivities}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Clear All Activities
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <Button
                  variant="link"
                  className="text-rose-500 font-medium p-0 hover:text-rose-600"
                  onClick={() => router.push("/statistics")}
                >
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            {activitiesLoading ? (
              <div className="flex items-center justify-center py-16">
                <LoaderThree />
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => {
                  const IconComponent = getIconComponent(activity.icon);
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-3 sm:p-4 hover:bg-accent hover:text-accent-foreground rounded-2xl transition-colors flex-wrap"
                    >
                      <div className="bg-muted rounded-xl p-3 flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-muted-foreground" />
                      </div>

                      {activity.imageUrl && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={activity.imageUrl}
                            alt={activity.description}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-card-foreground truncate">
                          {activity.action}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {activity.description}
                        </p>
                      </div>

                      <div className="w-full sm:w-auto mt-2 sm:mt-0 ml-0 sm:ml-auto flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
                        {activity.credits && (
                          <span className="text-xs bg-rose-500 text-white px-2 py-1 rounded-lg font-medium">
                            -{activity.credits} credits
                          </span>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">
                            {formatTimeAgo(activity.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6">
                  <div className="bg-muted-foreground rounded-lg p-2">
                    <File className="h-8 w-8 text-muted" />
                  </div>
                </div>
                <p className="text-muted-foreground font-medium mb-2 text-lg">
                  No recent activity
                </p>
                <p className="text-muted-foreground/70 text-sm">
                  Start creating to see your work here
                </p>
              </div>
            )}
          </div>

          {/* Quick Access */}
          <div className="bg-card rounded-3xl p-8 border">
            <h2 className="text-2xl font-semibold text-card-foreground mb-8">
              Quick Access
            </h2>

            <div className="space-y-4">
              {quickAccessItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-4 hover:bg-accent hover:text-accent-foreground rounded-2xl"
                  onClick={() => router.push(item.href)}
                >
                  <div className="bg-muted rounded-xl p-3 mr-4">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-card-foreground text-lg">
                    {item.title}
                  </span>
                </Button>
              ))}
            </div>

            {/* Low Credit Alert */}
            {showLowCreditAlert && (
              <div className="mt-8 bg-rose-500 border border-rose-600 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-rose-400 rounded-xl p-2.5">
                    <Triangle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2 text-lg">
                      Low Credit Alert
                    </h3>
                    <p className="text-sm text-rose-100 mb-4 leading-relaxed">
                      {creditsLoading
                        ? "Checking your credits..."
                        : `You have ${credits} credits remaining. Consider upgrading to continue creating.`}
                    </p>
                    <Button
                      className="bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-sm px-6 py-2.5 h-auto rounded-xl font-medium border border-rose-200"
                      onClick={() => router.push("/buy-credits")}
                      disabled={creditsLoading}
                    >
                      Buy Credits
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
