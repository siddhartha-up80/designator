/**
 * Fix a user's credits to the correct amount
 * This will adjust credits based on their transaction history
 *
 * Usage: node scripts/fix-user-credits.js <email>
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function fixUserCredits() {
  try {
    const email = process.argv[2];

    if (!email) {
      console.log("\n❌ Please provide an email address");
      console.log("Usage: node scripts/fix-user-credits.js <email>\n");
      return;
    }

    console.log(`\n🔧 Fixing credits for: ${email}`);
    console.log("━".repeat(70));

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        transactions: true,
      },
    });

    if (!user) {
      console.log(`\n❌ User not found: ${email}\n`);
      return;
    }

    console.log(`\n👤 Current State:`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Current Credits: ${user.credits}`);

    // Calculate what credits should be based on transactions
    const correctCredits = user.transactions.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );

    console.log(`\n📊 Analysis:`);
    console.log(`   Total from Transactions: ${correctCredits}`);
    console.log(`   Current Credits: ${user.credits}`);
    console.log(`   Difference: ${user.credits - correctCredits}`);

    if (user.credits === correctCredits) {
      console.log(`\n✅ Credits are already correct! No fix needed.\n`);
      return;
    }

    console.log(
      `\n🔧 Fixing credits from ${user.credits} to ${correctCredits}...`
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { credits: correctCredits },
    });

    console.log(`✅ Credits fixed successfully!`);
    console.log(`   Old: ${user.credits} credits`);
    console.log(`   New: ${correctCredits} credits`);
    console.log("\n━".repeat(70));
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixUserCredits()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
