/**
 * Interactive script to delete all users except the admin user
 * This will ask for confirmation before deleting
 * 
 * Usage: npx tsx scripts/cleanup-users-interactive.ts
 */

import { prisma } from "../src/lib/prisma";
import * as readline from "readline";

const ADMIN_EMAIL = "siddhartha.singh3093@gmail.com";

function askQuestion(query: string): Promise<string> {
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

async function cleanupUsersInteractive() {
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
      return;
    }

    console.log(`\n⚠️  Found ${usersToDelete.length} user(s) to delete:\n`);
    usersToDelete.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.email}`
      );
      console.log(
        `   Name: ${user.name || "N/A"} | Credits: ${user.credits} | Created: ${user.createdAt.toLocaleDateString()}`
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
      return;
    }

    console.log("\n⏳ Deleting users...\n");

    let deleteCount = 0;
    for (const user of usersToDelete) {
      try {
        await prisma.user.delete({
          where: { id: user.id },
        });

        console.log(`  ✅ Deleted: ${user.email}`);
        deleteCount++;
      } catch (error: any) {
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
cleanupUsersInteractive()
  .then(() => {
    console.log("\n✅ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
