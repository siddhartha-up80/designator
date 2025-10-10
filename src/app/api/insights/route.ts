import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get insights based on user activity patterns
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Weekly activity
    const weeklyActivity = await prisma.creditTransaction.count({
      where: {
        userId: user.id,
        createdAt: { gte: startOfWeek },
        amount: { lt: 0 },
      },
    });

    // Monthly activity
    const monthlyActivity = await prisma.creditTransaction.count({
      where: {
        userId: user.id,
        createdAt: { gte: startOfMonth },
        amount: { lt: 0 },
      },
    });

    // Yearly activity
    const yearlyActivity = await prisma.creditTransaction.count({
      where: {
        userId: user.id,
        createdAt: { gte: startOfYear },
        amount: { lt: 0 },
      },
    });

    // Get activity by hour of day
    const allTransactions = await prisma.creditTransaction.findMany({
      where: {
        userId: user.id,
        amount: { lt: 0 },
      },
      select: { createdAt: true },
    });

    const hourlyActivity = allTransactions.reduce((acc, transaction) => {
      const hour = transaction.createdAt.getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Find peak activity hour
    const peakHour = Object.entries(hourlyActivity).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0];

    const formatHour = (hour: string) => {
      const h = parseInt(hour);
      const period = h >= 12 ? "PM" : "AM";
      const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
      return `${displayHour}:00 ${period}`;
    };

    // Get streak information
    const recentTransactions = await prisma.creditTransaction.findMany({
      where: {
        userId: user.id,
        amount: { lt: 0 },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    // Calculate activity streak (consecutive days with activity)
    const activityDates = recentTransactions.map((t) =>
      t.createdAt.toDateString()
    );

    const uniqueDates = [...new Set(activityDates)].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    let currentStreak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    // Check if user was active today or yesterday to start streak
    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
      currentStreak = 1;

      for (let i = 1; i < uniqueDates.length; i++) {
        const currentDate = new Date(uniqueDates[i - 1]);
        const nextDate = new Date(uniqueDates[i]);
        const daysDiff =
          (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24);

        if (daysDiff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Generate personalized recommendations
    const recommendations = [];

    if (weeklyActivity < 3) {
      recommendations.push({
        type: "activity",
        title: "Stay Active",
        description:
          "Try to create something new this week to maintain momentum!",
      });
    }

    if (peakHour) {
      const peakTime = formatHour(peakHour);
      recommendations.push({
        type: "timing",
        title: "Optimal Time",
        description: `You're most creative around ${peakTime}. Schedule your sessions accordingly!`,
      });
    }

    if (currentStreak >= 3) {
      recommendations.push({
        type: "streak",
        title: "Great Streak!",
        description: `${currentStreak} days of activity! Keep the momentum going.`,
      });
    }

    const insights = {
      activity: {
        weekly: weeklyActivity,
        monthly: monthlyActivity,
        yearly: yearlyActivity,
      },
      patterns: {
        peakHour: peakHour ? formatHour(peakHour) : null,
        hourlyDistribution: hourlyActivity,
      },
      engagement: {
        streak: currentStreak,
        totalActiveDays: uniqueDates.length,
      },
      recommendations,
    };

    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Error fetching insights:", error);
    return NextResponse.json(
      { error: "Failed to fetch insights" },
      { status: 500 }
    );
  }
}
