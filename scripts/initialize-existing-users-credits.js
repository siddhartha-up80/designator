/**
 * Migration Script: Initialize Credits for Existing Users
 *
 * This script will:
 * 1. Find all users without credits initialized
 * 2. Give them 50 free credits
 * 3. Create SIGNUP_BONUS transactions
 *
 * Run with: node scripts/initialize-existing-users-credits.js
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function initializeExistingUserCredits() {
  console.log("🚀 Starting credit initialization for existing users...\n");

  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        credits: true,
        plan: true,
        createdAt: true,
      },
    });

    console.log(`📊 Found ${users.length} total users\n`);

    let initializedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        // Check if user already has a SIGNUP_BONUS transaction
        const existingBonus = await prisma.creditTransaction.findFirst({
          where: {
            userId: user.id,
            type: "SIGNUP_BONUS",
          },
        });

        if (existingBonus) {
          console.log(`⏭️  Skipped ${user.email} - Already has signup bonus`);
          skippedCount++;
          continue;
        }

        // Initialize credits
        const result = await prisma.$transaction([
          // Update user credits to 50 if they have less
          prisma.user.update({
            where: { id: user.id },
            data: {
              credits: user.credits < 50 ? 50 : user.credits,
            },
          }),
          // Create signup bonus transaction
          prisma.creditTransaction.create({
            data: {
              userId: user.id,
              amount: 50,
              type: "SIGNUP_BONUS",
              description:
                "Welcome bonus - Free credits for existing users (Migration)",
              metadata: {
                migration: true,
                previousCredits: user.credits,
                timestamp: new Date().toISOString(),
              },
            },
          }),
        ]);

        console.log(`✅ Initialized ${user.email} - Added 50 credits`);
        initializedCount++;
      } catch (error) {
        console.error(`❌ Error for ${user.email}:`, error.message);
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📈 Migration Summary:");
    console.log("=".repeat(60));
    console.log(`Total Users: ${users.length}`);
    console.log(`✅ Initialized: ${initializedCount}`);
    console.log(`⏭️  Skipped: ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log("=".repeat(60) + "\n");

    if (initializedCount > 0) {
      // Verify the results
      const totalCreditsDistributed = await prisma.creditTransaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          type: "SIGNUP_BONUS",
        },
      });

      console.log(
        "✨ Total credits distributed (all time):",
        totalCreditsDistributed._sum.amount
      );
    }

    console.log("\n🎉 Migration completed successfully!\n");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
initializeExistingUserCredits().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
