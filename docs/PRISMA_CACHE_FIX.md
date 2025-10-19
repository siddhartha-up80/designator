# Vercel Prisma Cache Fix - Force Prisma Client Regeneration

## Problem
Even though the code is updated with `credits: 0`, Vercel is still using an **old cached Prisma Client** that has the old schema with `@default(50)`.

## Root Cause
- Prisma generates a client during build time based on `schema.prisma`
- Vercel caches the `node_modules/@prisma/client` folder
- Even with new code, the cached Prisma Client still has the old default value
- The cached client is being used instead of regenerating from the new schema

## Solution: Force Prisma Client Regeneration on Vercel

### Step 1: Clear Vercel Build Cache

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **designator** project
3. Go to **Settings** → **General**
4. Scroll down to **Build & Development Settings**
5. Click **"Clear Build Cache"** button
6. Confirm the action

### Step 2: Add Prisma Postinstall Hook (If not already present)

Check if `package.json` has this in scripts:

```json
"scripts": {
  "postinstall": "prisma generate"
}
```

Let me verify and add it if missing.

### Step 3: Force Redeploy with Cache Cleared

After clearing cache:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **"Redeploy"**
4. ✅ Make sure "Use existing Build Cache" is **UNCHECKED**
5. Click confirm

### Step 4: Verify Build Logs

During the new deployment, check build logs for:

```
✓ Prisma schema loaded from prisma/schema.prisma
✓ Generated Prisma Client (v6.x.x) to ./node_modules/@prisma/client
```

This confirms Prisma Client was regenerated from the new schema.

## Alternative: Add a Build Command Override

### Update Vercel Build Settings:

1. Go to **Settings** → **General**
2. Find **Build & Development Settings**
3. Override **Build Command**:

```bash
npx prisma generate && next build && next-sitemap
```

This ensures Prisma generates fresh client every time.

## Quick Fix: Bump Prisma Version

Sometimes forcing a Prisma version change clears the cache:

1. Update `package.json`:
   ```json
   "@prisma/client": "^6.16.3",  // Bump from 6.16.2
   "prisma": "^6.16.3"
   ```

2. Run locally:
   ```bash
   npm install
   npm run build
   ```

3. Commit and push:
   ```bash
   git add package.json package-lock.json
   git commit -m "bump prisma version to clear cache"
   git push origin main
   ```

## Verification Steps

### After Deployment Completes:

1. **Check Vercel Logs** (Runtime Logs):
   - Go to **Deployments** → Click latest → **Logs**
   - Sign up with a new account
   - Look for: `"🆕 New user detected: [email] - No free credits given"`

2. **Check Build Logs**:
   - Should show: `Generated Prisma Client`
   - Verify no cache hit messages for Prisma

3. **Test on Production**:
   - Sign up with a completely new Google account
   - Check profile - should show **0 credits**

4. **Verify Database**:
   ```bash
   npm run check:user newuser@gmail.com
   ```
   Should show:
   - Current Credits: 0
   - Total from Transactions: 0
   - Signup Bonuses Found: 0

## Why This Happens

Vercel's caching strategy:
1. **Dependencies cache** (`node_modules`) - includes `@prisma/client`
2. **Build cache** - includes generated files
3. **Prisma Client** is generated once and cached
4. Schema changes don't trigger client regeneration if cache is hit

## Prevention for Future

Add this to your `vercel.json` (create if it doesn't exist):

```json
{
  "build": {
    "env": {
      "PRISMA_GENERATE_SKIP_AUTOINSTALL": "false"
    }
  }
}
```

Or add to build script in `package.json`:

```json
"scripts": {
  "vercel-build": "npx prisma generate && npm run build"
}
```

Vercel will use `vercel-build` if it exists instead of `build`.

## Immediate Action Required

**Option A: Manual (Fastest)**
1. ✅ Go to Vercel Dashboard
2. ✅ Settings → General → Clear Build Cache
3. ✅ Deployments → Redeploy (uncheck "Use existing cache")
4. ⏳ Wait 2-5 minutes
5. ✅ Test with new Google account

**Option B: Code Change (Safest)**
1. ✅ Update Prisma comment in schema.prisma
2. ✅ Add vercel-build script
3. ✅ Commit and push
4. ⏳ Auto-deploy triggers
5. ✅ Test

Let me help you with Option B now...
