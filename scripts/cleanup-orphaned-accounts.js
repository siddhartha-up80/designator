/**
 * Cleanup Script: Remove orphaned Account records
 *
 * This script will remove Account records that don't have a valid User
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function cleanupOrphanedAccounts() {
  console.log("🧹 Starting cleanup of orphaned accounts...\n");

  try {
    // Find all accounts
    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        userId: true,
        provider: true,
        providerAccountId: true,
      },
    });

    console.log(`📊 Found ${accounts.length} total accounts\n`);

    let deletedCount = 0;
    let validCount = 0;

    for (const account of accounts) {
      try {
        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { id: account.userId },
        });

        if (!user) {
          // Delete orphaned account
          await prisma.account.delete({
            where: { id: account.id },
          });
          console.log(
            `🗑️  Deleted orphaned account: ${account.provider} - ${account.providerAccountId}`
          );
          deletedCount++;
        } else {
          validCount++;
        }
      } catch (error) {
        console.error(
          `❌ Error processing account ${account.id}:`,
          error.message
        );
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📈 Cleanup Summary:");
    console.log("=".repeat(60));
    console.log(`Total Accounts: ${accounts.length}`);
    console.log(`✅ Valid: ${validCount}`);
    console.log(`🗑️  Deleted: ${deletedCount}`);
    console.log("=".repeat(60) + "\n");

    console.log("\n🎉 Cleanup completed successfully!\n");
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupOrphanedAccounts().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
