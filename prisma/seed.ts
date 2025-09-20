import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Start seeding...");

  // Create sample model images
  const modelImages = await Promise.all([
    prisma.modelImage.create({
      data: {
        name: "Professional Female Model",
        description:
          "Professional female model suitable for business and formal wear",
        imageUrl:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=300&fit=crop",
        gender: "FEMALE",
        category: ["formal", "business", "professional"],
        tags: ["professional", "business", "formal", "female"],
        isPublic: true,
        isApproved: true,
      },
    }),
    prisma.modelImage.create({
      data: {
        name: "Casual Male Model",
        description: "Young male model perfect for casual and streetwear",
        imageUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop",
        gender: "MALE",
        category: ["casual", "streetwear", "young"],
        tags: ["casual", "male", "young", "streetwear"],
        isPublic: true,
        isApproved: true,
      },
    }),
    prisma.modelImage.create({
      data: {
        name: "Elegant Evening Model",
        description:
          "Sophisticated female model for evening and formal occasions",
        imageUrl:
          "https://images.unsplash.com/photo-1494790108755-2616b2e7d2e6?w=400&h=600&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1494790108755-2616b2e7d2e6?w=200&h=300&fit=crop",
        gender: "FEMALE",
        category: ["evening", "formal", "elegant"],
        tags: ["evening", "elegant", "formal", "female"],
        isPublic: true,
        isApproved: true,
      },
    }),
    prisma.modelImage.create({
      data: {
        name: "Summer Fashion Model",
        description:
          "Fresh female model perfect for summer and bohemian styles",
        imageUrl:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=300&fit=crop",
        gender: "FEMALE",
        category: ["summer", "bohemian", "casual"],
        tags: ["summer", "bohemian", "casual", "female"],
        isPublic: true,
        isApproved: true,
      },
    }),
    prisma.modelImage.create({
      data: {
        name: "Athletic Male Model",
        description: "Fit male model ideal for sportswear and activewear",
        imageUrl:
          "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=600&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=200&h=300&fit=crop",
        gender: "MALE",
        category: ["athletic", "sportswear", "fitness"],
        tags: ["athletic", "sports", "fitness", "male"],
        isPublic: true,
        isApproved: true,
      },
    }),
    prisma.modelImage.create({
      data: {
        name: "Vintage Style Model",
        description: "Classic female model for vintage and retro fashion",
        imageUrl:
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=300&fit=crop",
        gender: "FEMALE",
        category: ["vintage", "retro", "classic"],
        tags: ["vintage", "retro", "classic", "female"],
        isPublic: true,
        isApproved: true,
      },
    }),
  ]);

  // Create sample app settings
  await prisma.appSetting.createMany({
    data: [
      {
        key: "free_plan_credits",
        value: 5,
      },
      {
        key: "pro_plan_credits",
        value: 100,
      },
      {
        key: "enterprise_plan_credits",
        value: -1, // Unlimited
      },
      {
        key: "max_image_size_mb",
        value: 10,
      },
      {
        key: "supported_formats",
        value: ["jpg", "jpeg", "png", "webp"],
      },
    ],
  });

  console.log("Seeding finished.");
  console.log(`Created ${modelImages.length} model images`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
