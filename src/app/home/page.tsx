"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ImageIcon,
  Sparkles,
  Camera,
  Shirt,
  Video,
  ArrowUpCircle,
  FileImage,
  TrendingUp,
  Users,
  Zap,
  Clock,
  Star,
  PlayCircle,
  Upload,
  Settings,
  Plus,
} from "lucide-react";

const quickActions = [
  {
    icon: Upload,
    title: "Upload Images",
    description: "Start by uploading your product images",
    href: "/automation",
    color: "bg-blue-500",
  },
  {
    icon: Shirt,
    title: "Try On Fashion",
    description: "Virtual fashion try-on with AI models",
    href: "/fashion-try-on",
    color: "bg-purple-500",
  },
  {
    icon: ArrowUpCircle,
    title: "Upscale Images",
    description: "Enhance image quality with AI",
    href: "/upscale",
    color: "bg-green-500",
  },
  {
    icon: Video,
    title: "Create Video",
    description: "Generate promotional videos",
    href: "/video",
    color: "bg-red-500",
  },
];

const recentProjects = [
  {
    id: 1,
    name: "Summer Collection 2024",
    type: "Fashion Try-On",
    images: 24,
    status: "completed",
    lastUpdated: "2 hours ago",
  },
  {
    id: 2,
    name: "Product Photography",
    type: "AI Enhancement",
    images: 12,
    status: "processing",
    lastUpdated: "5 minutes ago",
  },
  {
    id: 3,
    name: "Brand Campaign Video",
    type: "Video Generation",
    images: 8,
    status: "completed",
    lastUpdated: "1 day ago",
  },
];

const stats = [
  {
    title: "Images Generated",
    value: "2,847",
    change: "+12.5%",
    icon: ImageIcon,
    color: "text-blue-600",
  },
  {
    title: "Active Projects",
    value: "23",
    change: "+4",
    icon: Sparkles,
    color: "text-purple-600",
  },
  {
    title: "Processing Time",
    value: "1.2s",
    change: "-0.3s",
    icon: Zap,
    color: "text-yellow-600",
  },
  {
    title: "Satisfaction",
    value: "98.5%",
    change: "+2.1%",
    icon: Star,
    color: "text-green-600",
  },
];

const features = [
  {
    icon: Sparkles,
    title: "AI Model Generation",
    description: "Create realistic model photos with your products",
    href: "/automation",
  },
  {
    icon: Camera,
    title: "Photo Enhancement",
    description: "Professional photo editing with AI assistance",
    href: "/photography",
  },
  {
    icon: Shirt,
    title: "Virtual Try-On",
    description: "See how clothes look on different models",
    href: "/fashion-try-on",
  },
  {
    icon: Video,
    title: "Video Creation",
    description: "Generate promotional videos from images",
    href: "/video",
  },
  {
    icon: ArrowUpCircle,
    title: "Image Upscaling",
    description: "Enhance resolution and quality",
    href: "/upscale",
  },
  {
    icon: FileImage,
    title: "Prompt Generation",
    description: "Convert images to descriptive prompts",
    href: "/img-to-prompt",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            {getGreeting()}, Welcome to Designator! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Transform your fashion brand with AI-powered photography and content
            creation
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-sm text-green-500">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-3 hover:bg-muted/50"
                  onClick={() => router.push(action.href)}
                >
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Projects
              </CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{project.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{project.type}</span>
                      <span>•</span>
                      <span>{project.images} images</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {project.lastUpdated}
                    </p>
                  </div>
                  <Badge
                    variant={
                      project.status === "completed" ? "default" : "secondary"
                    }
                    className={
                      project.status === "processing" ? "animate-pulse" : ""
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Features Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Explore Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {features.map((feature, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => router.push(feature.href)}
                >
                  <feature.icon className="h-4 w-4 mr-3 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">{feature.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {feature.description}
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Section */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Ready to get started?</h3>
                <p className="text-muted-foreground">
                  Create your first AI-generated model photo in just a few
                  clicks.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/gallery")}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  View Gallery
                </Button>
                <Button onClick={() => router.push("/automation")}>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Creating
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground py-4">
          <p>
            Powered by advanced AI technology • Built for fashion brands •
            <Button
              variant="link"
              className="p-0 h-auto text-sm"
              onClick={() => router.push("/pricing")}
            >
              Upgrade to Pro
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
