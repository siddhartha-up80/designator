# Cleanup Scripts

Scripts to manage and clean up test users from the database.

## User Cleanup Script

Deletes all users from the database **except** `siddhartha.singh3093@gmail.com`.

### What Gets Deleted

When you run this script, it will permanently delete:
- User accounts
- OAuth connections (Google account links)
- Credit transaction history
- Payment records
- Gallery images
- All other related user data

The deletion uses cascade, so all related records are automatically cleaned up.

### Usage

**Option 1: Using npm script (Recommended)**
```bash
npm run cleanup:users
```

**Option 2: Direct execution**
```bash
node scripts/cleanup-users.js
```

**Option 3: TypeScript version (requires tsx)**
```bash
npx tsx scripts/cleanup-users-interactive.ts
```

### Safety Features

✅ **Confirmation Required** - Script will ask for confirmation before deleting  
✅ **Protected Account** - Admin account (`siddhartha.singh3093@gmail.com`) is never deleted  
✅ **Detailed Preview** - Shows list of users before deletion  
✅ **Summary Report** - Displays what was deleted after completion

### Example Output

```
🧹 User Cleanup Script
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Protected account: siddhartha.singh3093@gmail.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Found 3 user(s) to delete:

1. test.user1@gmail.com
   Name: Test User 1 | Credits: 50 | Created: 1/15/2025
2. test.user2@gmail.com
   Name: Test User 2 | Credits: 100 | Created: 1/16/2025
3. demo@example.com
   Name: Demo Account | Credits: 25 | Created: 1/17/2025

⚠️  WARNING: This will permanently delete:
   - User accounts
   - OAuth connections (Google accounts)
   - Credit transactions
   - Payment records
   - Gallery images
   - All other related data

❓ Are you sure you want to delete 3 user(s)? (yes/no): yes

⏳ Deleting users...

  ✅ Deleted: test.user1@gmail.com
  ✅ Deleted: test.user2@gmail.com
  ✅ Deleted: demo@example.com

✨ Cleanup complete!
📊 Summary:
   - Users deleted: 3
   - Users preserved: 1 (siddhartha.singh3093@gmail.com)

💡 Tip: You can now test new user signup to verify 50 credits!

✅ Script completed successfully!
```

### When to Use

This script is useful for:
- 🧪 **Testing** - Clean up test accounts after testing new user signup flow
- 🔄 **Development** - Reset database to a clean state during development
- ✅ **Verification** - Remove old test users to verify the 50 credits fix works correctly
- 🧹 **Maintenance** - Periodic cleanup of demo/test accounts

### After Running

After cleanup, you can:
1. Test new user signup with a fresh Google account
2. Verify the user gets exactly **50 credits** (not 100)
3. Check the console logs for the initialization messages
4. View transaction history at `/api/credits/transactions`

### Notes

⚠️ **Production Warning**: This script is intended for development/testing. Do not run in production unless you're absolutely sure you want to delete user data.

🔒 **Protected Account**: The admin account `siddhartha.singh3093@gmail.com` is hardcoded as protected and will never be deleted.

📝 **Google OAuth**: Note that deleting users from your database doesn't delete their Google accounts - it only removes the OAuth connection. Users can sign up again with the same Google account.
