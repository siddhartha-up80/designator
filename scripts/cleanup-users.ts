/**
 * Script to delete all users except the admin user
 * This will clean up test users from the database
 * 
 * WARNING: This will permanently delete user data!
 * 
 * Usage: npx tsx scripts/cleanup-users.ts
 */

import { prisma } from "../src/lib/prisma";

const ADMIN_EMAIL = "siddhartha.singh3093@gmail.com";

async function cleanupUsers() {
  try {
    console.log("🧹 Starting user cleanup...");
    console.log(`⚠️  Will delete ALL users EXCEPT: ${ADMIN_EMAIL}`);
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
        createdAt: true,
      },
    });

    if (usersToDelete.length === 0) {
      console.log("✅ No users to delete. Database is clean!");
      return;
    }

    console.log(`Found ${usersToDelete.length} user(s) to delete:\n`);
    usersToDelete.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.email} (${user.name || "No name"}) - Created: ${user.createdAt.toLocaleDateString()}`
      );
    });

    console.log("\n⏳ Deleting users and all related data...\n");

    // Delete each user (cascade will handle related data)
    let deleteCount = 0;
    for (const user of usersToDelete) {
      try {
        // The cascade delete will automatically remove:
        // - Accounts (OAuth connections)
        // - Sessions
        // - Credit transactions
        // - Payments
        // - Gallery images (if any)
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
    console.log(`   - Related data cleaned up automatically via cascade delete`);
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
