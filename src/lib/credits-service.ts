import { prisma } from "./prisma";

// Credit costs for different features
export const CREDIT_COSTS = {
  PHOTO_GENERATION: 25, // Fashion Try-on, Product Model
  TEXT_PROMPT: 10, // Prompt to Image, Image to Prompt
  PHOTO_ENHANCEMENT: 15, // Photography AI Enhancement & Style Presets
} as const;

// Plan configurations
export const PLAN_CONFIGS = {
  FREE: {
    name: "Free",
    credits: 0, // No free credits
    price: 0,
  },
  PRO: {
    name: "Pro",
    credits: 500,
    price: 29,
  },
  ENTERPRISE: {
    name: "Enterprise",
    credits: -1, // Unlimited
    price: 99,
  },
} as const;

export type TransactionType =
  | "PHOTO_GENERATION"
  | "TEXT_PROMPT"
  | "PHOTO_ENHANCEMENT"
  | "CREDIT_PURCHASE"
  | "SIGNUP_BONUS"
  | "REFUND";

export const creditsService = {
  /**
   * Get user's current credit balance
   */
  async getCredits(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, plan: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Enterprise users have unlimited credits
    if (user.plan === "ENTERPRISE") {
      return -1; // Represents unlimited
    }

    return user.credits;
  },

  /**
   * Check if user has enough credits
   */
  async hasEnoughCredits(userId: string, amount: number): Promise<boolean> {
    const credits = await this.getCredits(userId);

    // Unlimited credits
    if (credits === -1) {
      return true;
    }

    return credits >= amount;
  },

  /**
   * Deduct credits from user account
   */
  async deductCredits(
    userId: string,
    amount: number,
    type: TransactionType,
    description: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; remainingCredits: number; error?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true, plan: true },
      });

      if (!user) {
        return { success: false, remainingCredits: 0, error: "User not found" };
      }

      // Enterprise users don't need credit deduction
      if (user.plan === "ENTERPRISE") {
        await prisma.creditTransaction.create({
          data: {
            userId,
            amount: 0, // No deduction for enterprise
            type,
            description,
            metadata: metadata || {},
          },
        });
        return { success: true, remainingCredits: -1 };
      }

      // Check if user has enough credits
      if (user.credits < amount) {
        return {
          success: false,
          remainingCredits: user.credits,
          error: "Insufficient credits",
        };
      }

      // Deduct credits and create transaction record
      const [updatedUser] = await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { credits: { decrement: amount } },
        }),
        prisma.creditTransaction.create({
          data: {
            userId,
            amount: -amount,
            type,
            description,
            metadata: metadata || {},
          },
        }),
      ]);

      return {
        success: true,
        remainingCredits: updatedUser.credits,
      };
    } catch (error) {
      console.error("Error deducting credits:", error);
      return {
        success: false,
        remainingCredits: 0,
        error: "Failed to deduct credits",
      };
    }
  },

  /**
   * Add credits to user account
   */
  async addCredits(
    userId: string,
    amount: number,
    type: TransactionType,
    description: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; newBalance: number }> {
    try {
      const [updatedUser] = await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: amount } },
        }),
        prisma.creditTransaction.create({
          data: {
            userId,
            amount,
            type,
            description,
            metadata: metadata || {},
          },
        }),
      ]);

      return {
        success: true,
        newBalance: updatedUser.credits,
      };
    } catch (error) {
      console.error("Error adding credits:", error);
      return {
        success: false,
        newBalance: 0,
      };
    }
  },

  /**
   * Get user's transaction history
   */
  async getTransactionHistory(
    userId: string,
    limit = 50
  ): Promise<
    Array<{
      id: string;
      amount: number;
      type: string;
      description: string;
      metadata: any;
      createdAt: Date;
    }>
  > {
    const transactions = await prisma.creditTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return transactions;
  },

  /**
   * Initialize credits for new user
   */
  async initializeNewUserCredits(userId: string): Promise<void> {
    const creditsToAdd = PLAN_CONFIGS.FREE.credits;
    console.log(
      `💰 Adding ${creditsToAdd} signup bonus credits to user:`,
      userId
    );

    await this.addCredits(
      userId,
      creditsToAdd,
      "SIGNUP_BONUS",
      "Welcome bonus - Free credits for new users",
      { initialBonus: true }
    );

    console.log(`✅ Successfully added ${creditsToAdd} credits`);
  },

  /**
   * Get credit cost for a specific feature
   */
  getCreditCost(feature: keyof typeof CREDIT_COSTS): number {
    return CREDIT_COSTS[feature];
  },

  /**
   * Format credits display (handle unlimited)
   */
  formatCredits(credits: number): string {
    if (credits === -1) {
      return "Unlimited";
    }
    return credits.toString();
  },
};
