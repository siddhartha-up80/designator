# Fix Vercel Deployment - 0 Free Credits

## Problem
Vercel deployment is still giving new users 50 credits instead of 0 credits.

## Cause
The latest code changes are committed and pushed (commit: `b7a6079 remove free credits`), but Vercel hasn't rebuilt the application yet with the new changes.

## Solution

### Option 1: Trigger Redeploy via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (designator)
3. Go to the **Deployments** tab
4. Click on the latest deployment
5. Click **"Redeploy"** button
6. Wait for the build to complete

### Option 2: Force Push/Trigger via Git

1. Make a small change (add a comment or whitespace)
2. Commit and push:
   ```bash
   git commit --allow-empty -m "trigger vercel rebuild"
   git push origin main
   ```

### Option 3: Check Vercel Settings

1. Verify that auto-deployments are enabled
2. Go to Project Settings → Git → Production Branch
3. Ensure it's set to `main`
4. Check if there are any deployment hooks or restrictions

## Verification After Deployment

### Check 1: Verify the deployed code
1. Go to your Vercel deployment URL
2. Check browser console/network tab
3. Sign up with a new Google account
4. Check credits in the profile

Expected: **0 credits**

### Check 2: Check Vercel build logs
1. Go to Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Check the **Build Logs**
4. Look for:
   - "Building..." 
   - "Compiling..."
   - "Build completed"
5. Verify the commit hash matches: `b7a6079`

### Check 3: Verify environment variables
Ensure Vercel has the correct environment variables:
- `DATABASE_URL` (MongoDB connection)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GEMINI_API_KEY`
- etc.

## What Changed (in commit b7a6079)

### File 1: `src/lib/credits-service.ts`
```typescript
// BEFORE
FREE: {
  name: "Free",
  credits: 50,
  price: 0,
}

// AFTER
FREE: {
  name: "Free",
  credits: 0, // No free credits
  price: 0,
}
```

### File 2: `src/auth.ts`
```typescript
// BEFORE
await creditsService.initializeNewUserCredits(user.id);

// AFTER
// Signup bonus is disabled - users get 0 credits
/* ... commented out ... */
```

## Database Considerations

### Important: Existing users keep their credits
- Users who already signed up with 50 credits will keep those credits
- Only NEW users (after deployment) will get 0 credits

### If you want to reset existing users to 0 credits:

**WARNING: This will remove all credits from existing users!**

```bash
# Run this script locally (NOT on Vercel)
node scripts/reset-all-credits-to-zero.js
```

Or manually:
1. Connect to MongoDB Atlas
2. Run this query:
   ```javascript
   db.User.updateMany(
     { plan: "FREE" },
     { $set: { credits: 0 } }
   )
   ```

## Troubleshooting

### If Vercel still shows 50 credits after redeployment:

1. **Clear Vercel cache**:
   - Settings → General → Clear Build Cache
   - Redeploy

2. **Check if Prisma schema was migrated**:
   - Vercel runs `prisma generate` during build
   - Check build logs for Prisma generation

3. **Verify the deployed commit**:
   - In Vercel Dashboard → Deployment
   - Check "Source" or "Commit" - should show `b7a6079`

4. **Hard refresh the browser**:
   - Ctrl + Shift + R (Windows/Linux)
   - Cmd + Shift + R (Mac)
   - Or use incognito mode

5. **Check server logs**:
   - Vercel Dashboard → Logs
   - Look for: "🆕 New user detected: [email] - No free credits given"

## Expected Behavior After Fix

### New User Signup Flow:
1. User signs up with Google
2. Server logs: "🆕 New user detected: email@example.com - No free credits given (free credits disabled)"
3. User created with 0 credits
4. No SIGNUP_BONUS transaction created
5. User must purchase credits to use features

### Verification Commands:
```bash
# View all users and their credits
npm run view:users

# Check a specific user's credit history
npm run check:user email@example.com
```

## Timeline

- **Local code**: ✅ Updated (credits: 0)
- **Git commit**: ✅ Committed (b7a6079)
- **Git push**: ✅ Pushed to origin/main
- **Vercel deploy**: ⏳ Needs rebuild/redeploy
- **Production**: ❌ Still using old code (50 credits)

## Next Steps

1. ✅ Trigger Vercel redeploy (Option 1 above)
2. ⏳ Wait for build to complete (~2-5 minutes)
3. ✅ Test with new Google account
4. ✅ Verify 0 credits in profile
5. ✅ Check Vercel logs for confirmation message

---

**Need Help?**
- Check Vercel build logs for errors
- Verify environment variables are set
- Test locally with `npm run build` first
