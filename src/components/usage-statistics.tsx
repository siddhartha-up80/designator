"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Calendar,
  Activity,
  BarChart3,
  Zap,
  Award,
  Clock,
  FileImage,
  Wand2,
  Sparkles,
  Camera,
  RefreshCw,
} from "lucide-react";
import { useStatistics, UserStatistics } from "@/hooks/use-statistics";
import { Button } from "@/components/ui/button";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
    green: "text-green-600 bg-green-100 dark:bg-green-900/20",
    purple: "text-purple-600 bg-purple-100 dark:bg-purple-900/20",
    orange: "text-orange-600 bg-orange-100 dark:bg-orange-900/20",
    red: "text-red-600 bg-red-100 dark:bg-red-900/20",
  };

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className="flex items-center mt-2">
                <TrendingUp
                  className={`h-3 w-3 mr-1 ${
                    trend === "up"
                      ? "text-green-500"
                      : trend === "down"
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                />
                <span className="text-xs text-muted-foreground">
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const UsageStatistics: React.FC = () => {
  const { statistics, loading, error, refetch } = useStatistics();

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Summary skeleton */}
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded w-48"></div>
                  <div className="h-4 bg-muted rounded w-32"></div>
                </div>
                <div className="h-6 w-20 bg-muted rounded-full"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center space-y-1">
                    <div className="h-8 bg-muted rounded w-12 mx-auto"></div>
                    <div className="h-3 bg-muted rounded w-16 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-8 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                  <div className="h-12 w-12 bg-muted rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional skeletons */}
        {[1, 2, 3].map((i) => (
          <Card key={`extra-${i}`} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-48"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground mb-4">
            Failed to load statistics: {error}
          </div>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!statistics) {
    return null;
  }

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case "fashion try-on":
        return Camera;
      case "ai photography":
        return Sparkles;
      case "prompt generation":
        return Wand2;
      default:
        return Activity;
    }
  };

  const efficiency = statistics.insights.efficiencyScore;
  const getEfficiencyColor = (score: number) => {
    if (score >= 80) return "green";
    if (score >= 60) return "orange";
    return "red";
  };

  return (
    <div className="space-y-6">
      {/* Summary Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Your Designator Journey</h3>
              <p className="text-sm text-muted-foreground">
                Member since {statistics.overview.accountAge}
              </p>
            </div>
            <Badge variant="outline" className="bg-background">
              {statistics.overview.currentCredits} Credits
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {statistics.overview.totalImages}
              </div>
              <div className="text-xs text-muted-foreground">
                Total Creations
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {statistics.overview.totalCreditsSpent}
              </div>
              <div className="text-xs text-muted-foreground">Credits Used</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {statistics.insights.efficiencyScore}%
              </div>
              <div className="text-xs text-muted-foreground">Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {statistics.overview.recentActivity}
              </div>
              <div className="text-xs text-muted-foreground">
                Recent Activity
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Images Generated"
          value={statistics.overview.totalImages}
          icon={FileImage}
          color="blue"
          subtitle="Total creations"
        />
        <StatCard
          title="Credits Spent"
          value={statistics.overview.totalCreditsSpent}
          icon={Zap}
          color="purple"
          subtitle={`${statistics.overview.currentCredits} remaining`}
        />
        <StatCard
          title="Account Age"
          value={statistics.overview.accountAge}
          icon={Calendar}
          color="green"
          subtitle={`${statistics.usage.creditsPurchased} credits purchased`}
        />
        <StatCard
          title="Recent Activity"
          value={statistics.overview.recentActivity}
          icon={Activity}
          color="orange"
          subtitle="Last 30 days"
        />
      </div>

      {/* Feature Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Feature Usage Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Fashion Try-on</span>
                </div>
                <span className="text-sm font-bold">
                  {statistics.usage.fashionTryons}
                </span>
              </div>
              <Progress
                value={
                  (statistics.usage.fashionTryons /
                    Math.max(statistics.overview.totalImages, 1)) *
                  100
                }
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">AI Photography</span>
                </div>
                <span className="text-sm font-bold">
                  {statistics.usage.photosEnhanced}
                </span>
              </div>
              <Progress
                value={
                  (statistics.usage.photosEnhanced /
                    Math.max(statistics.overview.totalImages, 1)) *
                  100
                }
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Prompt Generation</span>
                </div>
                <span className="text-sm font-bold">
                  {statistics.usage.promptsCreated}
                </span>
              </div>
              <Progress
                value={
                  (statistics.usage.promptsCreated /
                    Math.max(statistics.overview.totalImages, 1)) *
                  100
                }
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Usage Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                {React.createElement(
                  getFeatureIcon(statistics.insights.favoriteFeature),
                  {
                    className: "h-5 w-5 text-primary",
                  }
                )}
                <div>
                  <p className="text-sm font-medium">Favorite Feature</p>
                  <p className="text-xs text-muted-foreground">Most used</p>
                </div>
              </div>
              <Badge variant="secondary">
                {statistics.insights.favoriteFeature}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Most Active Day</p>
                  <p className="text-xs text-muted-foreground">Peak usage</p>
                </div>
              </div>
              <Badge variant="secondary">
                {statistics.insights.mostActiveDay}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Daily Average</p>
                  <p className="text-xs text-muted-foreground">
                    Credits per day
                  </p>
                </div>
              </div>
              <Badge variant="secondary">
                {statistics.insights.avgDailyUsage}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Efficiency Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="relative">
                <div
                  className={`text-4xl font-bold ${
                    efficiency >= 80
                      ? "text-green-500"
                      : efficiency >= 60
                      ? "text-orange-500"
                      : "text-red-500"
                  }`}
                >
                  {efficiency}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Images per credit spent
                </p>
              </div>

              <Progress
                value={efficiency}
                className={`h-3 ${getEfficiencyColor(efficiency)}`}
              />

              <p className="text-xs text-muted-foreground">
                {efficiency >= 80
                  ? "Excellent efficiency! You're making great use of your credits."
                  : efficiency >= 60
                  ? "Good efficiency. Consider optimizing your usage patterns."
                  : efficiency > 0
                  ? "Room for improvement. Try batch processing or planning your creations."
                  : "Start creating to see your efficiency score!"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Monthly Usage Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(statistics.monthlyTrend).length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {Object.entries(statistics.monthlyTrend)
                  .slice(-6)
                  .map(([month, credits]) => (
                    <div
                      key={month}
                      className="text-center p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="text-xs text-muted-foreground mb-1">
                        {new Date(month + "-01").toLocaleDateString("en", {
                          month: "short",
                          year: "2-digit",
                        })}
                      </div>
                      <div className="font-semibold">{credits}</div>
                      <div className="text-xs text-muted-foreground">
                        credits
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Start creating to see your usage trends!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Productivity Tips and Account Plan removed per request */}
    </div>
  );
};

export default UsageStatistics;
