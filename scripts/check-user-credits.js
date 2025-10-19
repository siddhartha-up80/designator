/**
 * Check a specific user's credit transactions
 *
 * Usage: node scripts/check-user-credits.js <email>
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkUserCredits() {
  try {
    const email = process.argv[2] || "singh.geeta2014@gmail.com";

    console.log(`\n🔍 Checking credits for: ${email}`);
    console.log("━".repeat(70));

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      console.log(`\n❌ User not found: ${email}\n`);
      return;
    }

    console.log(`\n👤 User Info:`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Current Credits: ${user.credits}`);
    console.log(`   Plan: ${user.plan}`);
    console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`);
    console.log(`   User ID: ${user.id}`);

    console.log(`\n💳 Credit Transactions (${user.transactions.length}):`);

    if (user.transactions.length === 0) {
      console.log(`   No transactions found`);
    } else {
      user.transactions.forEach((tx, index) => {
        const sign = tx.amount >= 0 ? "+" : "";
        console.log(`\n   ${index + 1}. ${tx.type}`);
        console.log(`      Amount: ${sign}${tx.amount} credits`);
        console.log(`      Description: ${tx.description}`);
        console.log(`      Date: ${new Date(tx.createdAt).toLocaleString()}`);
        if (tx.metadata && Object.keys(tx.metadata).length > 0) {
          console.log(`      Metadata:`, JSON.stringify(tx.metadata, null, 2));
        }
      });
    }

    // Calculate total from transactions
    const totalFromTransactions = user.transactions.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );

    console.log(`\n📊 Summary:`);
    console.log(`   Current Credits: ${user.credits}`);
    console.log(`   Total from Transactions: ${totalFromTransactions}`);

    if (user.credits !== totalFromTransactions) {
      console.log(
        `   ⚠️  MISMATCH! Difference: ${user.credits - totalFromTransactions}`
      );
      console.log(
        `   This suggests the user was created with initial credits before transactions.`
      );
    }

    // Check for SIGNUP_BONUS
    const signupBonuses = user.transactions.filter(
      (tx) => tx.type === "SIGNUP_BONUS"
    );

    console.log(`\n🎁 Signup Bonuses Found: ${signupBonuses.length}`);
    if (signupBonuses.length > 1) {
      console.log(`   ⚠️  WARNING: Multiple signup bonuses detected!`);
    }

    signupBonuses.forEach((bonus, index) => {
      console.log(`   ${index + 1}. Amount: ${bonus.amount} credits`);
      console.log(`      Date: ${new Date(bonus.createdAt).toLocaleString()}`);
    });

    console.log("\n━".repeat(70));
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkUserCredits()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
