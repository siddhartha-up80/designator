import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { creditsService } from "@/lib/credits-service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const { prisma } = await import("@/lib/prisma");
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, credits: true, plan: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const credits = await creditsService.getCredits(user.id);

    return NextResponse.json({
      credits,
      plan: user.plan,
      formatted: creditsService.formatCredits(credits),
    });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
}
