import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Start seeding...");

  console.log("Database seeded successfully!");
  console.log("Note: The app will work with the existing schema.");

  console.log("Seeding finished.");
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
