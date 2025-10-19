/**
 * Script to delete all users except the admin user
 * JavaScript version - no additional dependencies needed
 * 
 * WARNING: This will permanently delete user data!
 * 
 * Usage: node scripts/cleanup-users.js
 */

const { PrismaClient } = require("@prisma/client");
const readline = require("readline");

const prisma = new PrismaClient();
const ADMIN_EMAIL = "siddhartha.singh3093@gmail.com";

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

async function cleanupUsers() {
  try {
    console.log("🧹 User Cleanup Script");
    console.log("━".repeat(50));
    console.log(`Protected account: ${ADMIN_EMAIL}`);
    console.log("━".repeat(50));
    console.log("");

    // Get all users except admin
    const usersToDelete = await prisma.user.findMany({
      where: {
        email: {
          not: ADMIN_EMAIL,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        createdAt: true,
      },
    });

    if (usersToDelete.length === 0) {
      console.log("✅ No users to delete. Database is clean!");
      await prisma.$disconnect();
      return;
    }

    console.log(`\n⚠️  Found ${usersToDelete.length} user(s) to delete:\n`);
    usersToDelete.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(
        `   Name: ${user.name || "N/A"} | Credits: ${user.credits} | Created: ${new Date(
          user.createdAt
        ).toLocaleDateString()}`
      );
    });

    console.log("\n⚠️  WARNING: This will permanently delete:");
    console.log("   - User accounts");
    console.log("   - OAuth connections (Google accounts)");
    console.log("   - Credit transactions");
    console.log("   - Payment records");
    console.log("   - Gallery images");
    console.log("   - All other related data");
    console.log("");

    const answer = await askQuestion(
      `❓ Are you sure you want to delete ${usersToDelete.length} user(s)? (yes/no): `
    );

    if (answer.toLowerCase() !== "yes") {
      console.log("\n❌ Cleanup cancelled. No changes made.");
      await prisma.$disconnect();
      return;
    }

    console.log("\n⏳ Deleting users...\n");

    let deleteCount = 0;
    for (const user of usersToDelete) {
      try {
        // The cascade delete will automatically remove:
        // - Accounts (OAuth connections)
        // - Sessions
        // - Credit transactions
        // - Payments
        await prisma.user.delete({
          where: { id: user.id },
        });

        console.log(`  ✅ Deleted: ${user.email}`);
        deleteCount++;
      } catch (error) {
        console.error(`  ❌ Failed to delete ${user.email}:`, error.message);
      }
    }

    console.log(`\n✨ Cleanup complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Users deleted: ${deleteCount}`);
    console.log(`   - Users preserved: 1 (${ADMIN_EMAIL})`);
    console.log("\n💡 Tip: You can now test new user signup to verify 50 credits!");
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupUsers()
  .then(() => {
    console.log("\n✅ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
