import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TransactionType, GalleryImageType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        createdAt: true,
        credits: true,
        plan: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate account age
    const accountAge = Math.floor(
      (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    const accountAgeFormatted =
      accountAge < 30
        ? `${accountAge} days`
        : `${Math.floor(accountAge / 30)} months`;

    // Get total images generated
    const totalImages = await prisma.galleryImage.count({
      where: { userId: user.id },
    });

    // Get images by type
    const imagesByType = await prisma.galleryImage.groupBy({
      by: ["type"],
      where: { userId: user.id },
      _count: { type: true },
    });

    // Get credit transactions for usage analysis
    const creditTransactions = await prisma.creditTransaction.findMany({
      where: { userId: user.id },
      select: {
        type: true,
        amount: true,
        createdAt: true,
        description: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate usage statistics
    const usageStats = creditTransactions.reduce(
      (acc, transaction) => {
        switch (transaction.type) {
          case TransactionType.PHOTO_GENERATION:
            acc.fashionTryons += Math.abs(transaction.amount) / 25; // 25 credits per generation
            break;
          case TransactionType.TEXT_PROMPT:
            acc.promptsCreated += Math.abs(transaction.amount) / 10; // 10 credits per prompt
            break;
          case TransactionType.PHOTO_ENHANCEMENT:
            acc.photosEnhanced += Math.abs(transaction.amount) / 15; // 15 credits per enhancement
            break;
          case TransactionType.CREDIT_PURCHASE:
            acc.creditsPurchased += transaction.amount;
            break;
        }
        return acc;
      },
      {
        fashionTryons: 0,
        promptsCreated: 0,
        photosEnhanced: 0,
        creditsPurchased: 0,
      }
    );

    // Calculate total credits spent
    const totalCreditsSpent = creditTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Get most active day of week
    const dayActivity = creditTransactions.reduce((acc, transaction) => {
      const day = transaction.createdAt.getDay();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const mostActiveDay = Object.entries(dayActivity).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0];

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const mostActiveDayName = mostActiveDay
      ? dayNames[parseInt(mostActiveDay)]
      : "Not enough data";

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await prisma.creditTransaction.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: thirtyDaysAgo,
        },
        amount: { lt: 0 }, // Only count usage, not purchases
      },
    });

    // Get monthly usage trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyUsage = await prisma.creditTransaction.groupBy({
      by: ["createdAt"],
      where: {
        userId: user.id,
        createdAt: {
          gte: sixMonthsAgo,
        },
        amount: { lt: 0 },
      },
      _sum: { amount: true },
    });

    const monthlyTrend = monthlyUsage.reduce((acc, usage) => {
      const month = usage.createdAt.toISOString().substring(0, 7); // YYYY-MM format
      acc[month] = (acc[month] || 0) + Math.abs(usage._sum.amount || 0);
      return acc;
    }, {} as Record<string, number>);

    // Get favorite feature based on usage
    const featureUsage = {
      "Fashion Try-on": usageStats.fashionTryons,
      "AI Photography": usageStats.photosEnhanced,
      "Prompt Generation": usageStats.promptsCreated,
    };

    const favoriteFeature =
      Object.entries(featureUsage).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "Not enough data";

    // Calculate average daily usage
    const avgDailyUsage =
      accountAge > 0 ? Math.round(totalCreditsSpent / accountAge) : 0;

    const statistics = {
      overview: {
        totalImages,
        totalCreditsSpent,
        accountAge: accountAgeFormatted,
        currentCredits: user.credits,
        plan: user.plan,
        recentActivity: recentActivity,
      },
      usage: {
        fashionTryons: Math.round(usageStats.fashionTryons),
        promptsCreated: Math.round(usageStats.promptsCreated),
        photosEnhanced: Math.round(usageStats.photosEnhanced),
        creditsPurchased: usageStats.creditsPurchased,
      },
      insights: {
        favoriteFeature,
        mostActiveDay: mostActiveDayName,
        avgDailyUsage,
        efficiencyScore:
          totalCreditsSpent > 0
            ? Math.round((totalImages / totalCreditsSpent) * 100)
            : 0,
      },
      imagesByType: imagesByType.reduce((acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
      }, {} as Record<string, number>),
      monthlyTrend,
    };

    return NextResponse.json({ statistics });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
