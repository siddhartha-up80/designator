import { prisma } from "./prisma";

// User management
export const userService = {
  async createUser(data: { email: string; name?: string; avatar?: string }) {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        image: data.avatar,
        credits: 50, // Default signup bonus
      },
    });
  },

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async updateUserCredits(userId: string, credits: number) {
    return prisma.user.update({
      where: { id: userId },
      data: { credits },
    });
  },

  async getUserStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        credits: true,
        createdAt: true,
      },
    });

    if (!user) return null;

    return {
      totalCredits: user.credits,
      joinDate: user.createdAt,
    };
  },
};

// Gallery management - simplified version that works with existing schema
export const galleryService = {
  async createGalleryItem(data: {
    userId: string;
    title: string;
    imageUrl: string;
    type:
      | "FASHION_TRYON"
      | "PRODUCT_MODEL"
      | "PROMPT_TO_IMAGE"
      | "AI_PHOTOGRAPHY";
  }) {
    return prisma.galleryImage.create({
      data,
    });
  },

  async getUserGallery(
    userId: string,
    options: {
      type?:
        | "FASHION_TRYON"
        | "PRODUCT_MODEL"
        | "PROMPT_TO_IMAGE"
        | "AI_PHOTOGRAPHY";
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const where: any = { userId };

    if (options.type) {
      where.type = options.type;
    }

    return prisma.galleryImage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: options.limit,
      skip: options.offset,
    });
  },

  async updateGalleryItem(id: string, data: { title?: string }) {
    return prisma.galleryImage.update({
      where: { id },
      data,
    });
  },

  async deleteGalleryItem(id: string) {
    return prisma.galleryImage.delete({
      where: { id },
    });
  },
};

// Simplified services for production
export const tryOnService = {
  // Placeholder for try-on functionality - can be extended later
  async logTryOn(userId: string, data: any) {
    // Log try-on activity if needed
    console.log(`Try-on logged for user ${userId}`);
    return { success: true };
  },
};

export const usageService = {
  // Placeholder for usage tracking - can be extended later
  async logUsage(userId: string, feature: string, data: any) {
    // Log usage activity if needed
    console.log(`Usage logged for user ${userId}: ${feature}`);
    return { success: true };
  },
};
