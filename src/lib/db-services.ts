import { prisma } from "./prisma";
import { Gender, Plan, Status, GalleryType } from "@prisma/client";

// User management
export const userService = {
  async createUser(data: {
    email: string;
    name?: string;
    avatar?: string;
    plan?: Plan;
  }) {
    return prisma.user.create({
      data: {
        ...data,
        credits:
          data.plan === "PRO" ? 100 : data.plan === "ENTERPRISE" ? 999999 : 5,
      },
    });
  },

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        projects: true,
        galleryItems: true,
      },
    });
  },

  async updateUserCredits(userId: string, credits: number) {
    return prisma.user.update({
      where: { id: userId },
      data: { credits },
    });
  },

  async getUserStats(userId: string) {
    const [tryOnsCount, galleryItemsCount, projectsCount] = await Promise.all([
      prisma.tryOn.count({ where: { userId } }),
      prisma.galleryItem.count({ where: { userId } }),
      prisma.project.count({ where: { userId } }),
    ]);

    return {
      tryOnsCount,
      galleryItemsCount,
      projectsCount,
    };
  },
};

// Model images management
export const modelService = {
  async getPublicModels(filters?: {
    gender?: Gender;
    category?: string[];
    tags?: string[];
    search?: string;
  }) {
    const where: any = {
      isPublic: true,
      isApproved: true,
    };

    if (filters?.gender) {
      where.gender = filters.gender;
    }

    if (filters?.category?.length) {
      where.category = {
        hasSome: filters.category,
      };
    }

    if (filters?.tags?.length) {
      where.tags = {
        hasSome: filters.tags,
      };
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { tags: { hasSome: [filters.search] } },
      ];
    }

    return prisma.modelImage.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  },

  async getFavoriteModels(userId: string) {
    return prisma.modelImage.findMany({
      where: {
        favorites: {
          some: {
            userId,
          },
        },
      },
      include: {
        favorites: {
          where: { userId },
        },
      },
    });
  },

  async toggleFavorite(userId: string, modelImageId: string) {
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_modelImageId: {
          userId,
          modelImageId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return false;
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          modelImageId,
        },
      });
      return true;
    }
  },
};

// Try-on management
export const tryOnService = {
  async createTryOn(data: {
    userId: string;
    projectId?: string;
    modelImageId?: string;
    customModelImageUrl?: string;
    garmentImageUrl: string;
    backgroundImageUrl?: string;
    numberOfImages?: number;
    settings?: any;
  }) {
    return prisma.tryOn.create({
      data: {
        ...data,
        status: "PROCESSING",
      },
    });
  },

  async updateTryOnResult(
    tryOnId: string,
    data: {
      resultImageUrl: string;
      status: Status;
      processingTime?: number;
    }
  ) {
    return prisma.tryOn.update({
      where: { id: tryOnId },
      data,
    });
  },

  async getUserTryOns(userId: string, limit = 50) {
    return prisma.tryOn.findMany({
      where: { userId },
      include: {
        modelImage: true,
        project: true,
        galleryItem: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },
};

// Gallery management
export const galleryService = {
  async createGalleryItem(data: {
    title: string;
    description?: string;
    imageUrl: string;
    thumbnailUrl?: string;
    type: GalleryType;
    category: string;
    tags: string[];
    userId: string;
    projectId?: string;
    tryOnId?: string;
    isPublic?: boolean;
    metadata?: any;
  }) {
    return prisma.galleryItem.create({
      data,
    });
  },

  async getPublicGallery(filters?: {
    type?: GalleryType;
    category?: string;
    tags?: string[];
    search?: string;
    limit?: number;
  }) {
    const where: any = {
      isPublic: true,
    };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.category) {
      where.category = { contains: filters.category, mode: "insensitive" };
    }

    if (filters?.tags?.length) {
      where.tags = {
        hasSome: filters.tags,
      };
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { tags: { hasSome: [filters.search] } },
      ];
    }

    return prisma.galleryItem.findMany({
      where,
      include: {
        user: {
          select: { name: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: filters?.limit || 50,
    });
  },

  async incrementViews(galleryItemId: string) {
    return prisma.galleryItem.update({
      where: { id: galleryItemId },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  },

  async incrementLikes(galleryItemId: string) {
    return prisma.galleryItem.update({
      where: { id: galleryItemId },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
  },

  async incrementDownloads(galleryItemId: string) {
    return prisma.galleryItem.update({
      where: { id: galleryItemId },
      data: {
        downloads: {
          increment: 1,
        },
      },
    });
  },
};

// Project management
export const projectService = {
  async createProject(data: {
    name: string;
    description?: string;
    type: any; // ProjectType
    userId: string;
  }) {
    return prisma.project.create({
      data,
    });
  },

  async getUserProjects(userId: string) {
    return prisma.project.findMany({
      where: { userId },
      include: {
        galleryItems: true,
        tryOns: true,
        _count: {
          select: {
            galleryItems: true,
            tryOns: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  },
};

// Usage tracking
export const usageService = {
  async logUsage(data: {
    userId: string;
    action: string;
    credits: number;
    metadata?: any;
  }) {
    return prisma.usageLog.create({
      data,
    });
  },

  async getUserUsage(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    return prisma.usageLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  },
};
