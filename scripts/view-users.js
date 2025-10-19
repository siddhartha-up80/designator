/**
 * View all users in the database
 * No deletions - read-only script
 * 
 * Usage: node scripts/view-users.js
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const ADMIN_EMAIL = "siddhartha.singh3093@gmail.com";

async function viewUsers() {
  try {
    console.log("\n👥 All Users in Database");
    console.log("━".repeat(70));

    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        plan: true,
        createdAt: true,
        _count: {
          select: {
            transactions: true,
            payments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (allUsers.length === 0) {
      console.log("\n📭 No users found in database.\n");
      return;
    }

    console.log(`\n📊 Total Users: ${allUsers.length}\n`);

    allUsers.forEach((user, index) => {
      const isAdmin = user.email === ADMIN_EMAIL;
      const badge = isAdmin ? " 🛡️ [PROTECTED]" : "";

      console.log(`${index + 1}. ${user.email}${badge}`);
      console.log(`   Name: ${user.name || "N/A"}`);
      console.log(`   Credits: ${user.credits} | Plan: ${user.plan}`);
      console.log(
        `   Transactions: ${user._count.transactions} | Payments: ${user._count.payments}`
      );
      console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`);
      console.log(`   ID: ${user.id}`);
      console.log("");
    });

    // Summary
    const totalCredits = allUsers.reduce((sum, user) => sum + user.credits, 0);
    const totalTransactions = allUsers.reduce(
      (sum, user) => sum + user._count.transactions,
      0
    );
    const totalPayments = allUsers.reduce(
      (sum, user) => sum + user._count.payments,
      0
    );

    console.log("━".repeat(70));
    console.log("📈 Summary:");
    console.log(`   Total Users: ${allUsers.length}`);
    console.log(`   Total Credits: ${totalCredits}`);
    console.log(`   Total Transactions: ${totalTransactions}`);
    console.log(`   Total Payments: ${totalPayments}`);
    console.log(`   Protected Account: ${ADMIN_EMAIL}`);
    console.log("━".repeat(70));

    // Check for duplicate signups
    const usersWithMultipleTransactions = allUsers.filter(
      (u) => u._count.transactions > 0
    );
    if (usersWithMultipleTransactions.length > 0) {
      console.log("\n💡 Users with transaction history:");
      usersWithMultipleTransactions.forEach((user) => {
        console.log(
          `   - ${user.email}: ${user._count.transactions} transaction(s)`
        );
      });
    }

    console.log("");
  } catch (error) {
    console.error("❌ Error viewing users:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
viewUsers()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
