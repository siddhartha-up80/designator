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
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            <p className="text-xl sm:text-2xl font-bold mt-0.5 sm:mt-1 truncate">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">
                {subtitle}
              </p>
            )}
            {trend && trendValue && (
              <div className="flex items-center mt-1 sm:mt-2">
                <TrendingUp
                  className={`h-3 w-3 mr-1 flex-shrink-0 ${
                    trend === "up"
                      ? "text-green-500"
                      : trend === "down"
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                />
                <span className="text-xs text-muted-foreground truncate">
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div
            className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${colorClasses[color]}`}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
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
      <div className="space-y-4 sm:space-y-6">
        {/* Summary skeleton */}
        <Card className="animate-pulse">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="h-4 sm:h-5 bg-muted rounded w-32 sm:w-48"></div>
                  <div className="h-3 sm:h-4 bg-muted rounded w-24 sm:w-32"></div>
                </div>
                <div className="h-5 sm:h-6 w-16 sm:w-20 bg-muted rounded-full"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center space-y-1">
                    <div className="h-6 sm:h-8 bg-muted rounded w-10 sm:w-12 mx-auto"></div>
                    <div className="h-2.5 sm:h-3 bg-muted rounded w-12 sm:w-16 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5 sm:space-y-2 flex-1">
                    <div className="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-6 sm:h-8 bg-muted rounded w-1/2"></div>
                    <div className="h-2.5 sm:h-3 bg-muted rounded w-2/3"></div>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-muted rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional skeletons */}
        {[1, 2, 3].map((i) => (
          <Card key={`extra-${i}`} className="animate-pulse">
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <div className="h-5 sm:h-6 bg-muted rounded w-32 sm:w-48"></div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
              <div className="space-y-2 sm:space-y-3">
                <div className="h-3 sm:h-4 bg-muted rounded w-full"></div>
                <div className="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 sm:h-4 bg-muted rounded w-1/2"></div>
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
        <CardContent className="p-4 sm:p-6 text-center">
          <div className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm">
            Failed to load statistics: {error}
          </div>
          <Button
            onClick={refetch}
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm h-8 sm:h-9"
          >
            <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
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
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10">
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold truncate">
                Your Designator Journey
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                Member since {statistics.overview.accountAge}
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-background flex-shrink-0 text-xs sm:text-sm h-6 sm:h-7 px-2 sm:px-3"
            >
              {statistics.overview.currentCredits} Credits
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                {statistics.overview.totalImages}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                Total Creations
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                {statistics.overview.totalCreditsSpent}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                Credits Used
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                {statistics.insights.efficiencyScore}%
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                Efficiency
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-orange-600">
                {statistics.overview.recentActivity}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                Recent Activity
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <span className="truncate">Feature Usage Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                  <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium truncate">
                    Fashion Try-on
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold flex-shrink-0">
                  {statistics.usage.fashionTryons}
                </span>
              </div>
              <Progress
                value={
                  (statistics.usage.fashionTryons /
                    Math.max(statistics.overview.totalImages, 1)) *
                  100
                }
                className="h-1.5 sm:h-2"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium truncate">
                    AI Photography
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold flex-shrink-0">
                  {statistics.usage.photosEnhanced}
                </span>
              </div>
              <Progress
                value={
                  (statistics.usage.photosEnhanced /
                    Math.max(statistics.overview.totalImages, 1)) *
                  100
                }
                className="h-1.5 sm:h-2"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                  <Wand2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium truncate">
                    Prompt Generation
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold flex-shrink-0">
                  {statistics.usage.promptsCreated}
                </span>
              </div>
              <Progress
                value={
                  (statistics.usage.promptsCreated /
                    Math.max(statistics.overview.totalImages, 1)) *
                  100
                }
                className="h-1.5 sm:h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="p-3 sm:p-4 md:p-6">
            <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="truncate">Usage Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 sm:space-y-3 md:space-y-4 p-3 sm:p-4 md:p-6 pt-0">
            <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                {React.createElement(
                  getFeatureIcon(statistics.insights.favoriteFeature),
                  {
                    className:
                      "h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0",
                  }
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium truncate">
                    Favorite Feature
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    Most used
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="flex-shrink-0 text-xs max-w-[120px] truncate"
              >
                {statistics.insights.favoriteFeature}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium truncate">
                    Most Active Day
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    Peak usage
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="flex-shrink-0 text-xs">
                {statistics.insights.mostActiveDay}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium truncate">
                    Daily Average
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    Credits per day
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="flex-shrink-0 text-xs">
                {statistics.insights.avgDailyUsage}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 sm:p-4 md:p-6">
            <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="truncate">Efficiency Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="relative">
                <div
                  className={`text-3xl sm:text-4xl font-bold ${
                    efficiency >= 80
                      ? "text-green-500"
                      : efficiency >= 60
                      ? "text-orange-500"
                      : "text-red-500"
                  }`}
                >
                  {efficiency}%
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                  Images per credit spent
                </p>
              </div>

              <Progress
                value={efficiency}
                className={`h-2 sm:h-3 ${getEfficiencyColor(efficiency)}`}
              />

              <p className="text-[10px] sm:text-xs text-muted-foreground">
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
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <span className="truncate">Monthly Usage Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
          <div className="space-y-3 sm:space-y-4">
            {Object.entries(statistics.monthlyTrend).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {Object.entries(statistics.monthlyTrend)
                  .slice(-6)
                  .map(([month, credits]) => (
                    <div
                      key={month}
                      className="text-center p-2 sm:p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 truncate">
                        {new Date(month + "-01").toLocaleDateString("en", {
                          month: "short",
                          year: "2-digit",
                        })}
                      </div>
                      <div className="font-semibold text-sm sm:text-base">
                        {credits}
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">
                        credits
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-6 sm:py-8">
                <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
                <p className="text-xs sm:text-sm">
                  Start creating to see your usage trends!
                </p>
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
