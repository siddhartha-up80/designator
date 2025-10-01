# Quick Start Guide - User Authentication Setup

## ⚡ Quick Setup (5 Minutes)

### 1. Install Dependencies (Already Done)

```bash
npm install --legacy-peer-deps
```

### 2. Set Up MongoDB Database

**Option A: MongoDB Atlas (Recommended - Free)**

1. Visit: https://www.mongodb.com/cloud/atlas
2. Create free account → New Cluster (M0 Free)
3. Click "Connect" → "Connect your application"
4. Copy connection string

**Option B: Local MongoDB**

```bash
mongodb://localhost:27017/designator
```

### 3. Set Up Google OAuth

1. Visit: https://console.cloud.google.com/
2. Create new project
3. Enable "Google+ API" in APIs & Services → Library
4. Create OAuth 2.0 Client ID:
   - Go to: APIs & Services → Credentials
   - Create Credentials → OAuth client ID → Web application
   - Add redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Save Client ID and Client Secret

### 4. Configure Environment Variables

Create `.env` file (or update existing):

```bash
# MongoDB (REQUIRED)
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/designator?retryWrites=true&w=majority"

# NextAuth (REQUIRED)
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (REQUIRED)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

**Generate NEXTAUTH_SECRET:**

```bash
# Run this command and copy the output:
openssl rand -base64 32

# Or use: https://generate-secret.vercel.app/32
```

### 5. Set Up Database

**IMPORTANT:** Close VS Code or any processes that might be using the Prisma client, then run:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to MongoDB
npx prisma db push
```

**If you get EPERM errors on Windows:**

1. Close your dev server if running
2. Close VS Code
3. Open a new PowerShell window
4. Run the commands again

### 6. Start the Application

```bash
npm run dev
```

Visit: http://localhost:3000

## ✅ Test Authentication

1. Go to: http://localhost:3000/signin
2. Click "Continue with Google"
3. Sign in with your Google account
4. You'll be redirected to `/home`
5. Visit `/profile` to see your user info
6. Click the logout button in the header

## 📁 What Was Created

```
src/
├── auth.ts                          # NextAuth v5 configuration
├── middleware.ts                    # Route protection
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # Auth API
│   ├── signin/page.tsx              # Updated with Google OAuth
│   ├── signup/page.tsx              # Updated with Google OAuth
│   └── profile/page.tsx             # New user profile page
├── components/
│   ├── session-provider.tsx        # Session wrapper
│   └── header.tsx                   # Updated with user menu
├── hooks/
│   └── use-auth.ts                 # Auth helper hook
└── types/
    └── next-auth.d.ts              # TypeScript types

prisma/
└── schema.prisma                    # Updated with User models
```

## 🔒 Protected Routes

All routes are protected by default except:

- `/` (home/landing)
- `/signin`
- `/signup`
- `/api/auth/*`

Users will be redirected to `/signin` if not authenticated.

## 💡 Usage Examples

### Check if user is logged in (Client Component):

```tsx
"use client";
import { useAuth } from "@/hooks/use-auth";

export default function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not logged in</div>;

  return <div>Welcome {user?.name}</div>;
}
```

### Protect a page (Server Component):

```tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth();
  if (!session) redirect("/signin");

  return <div>Protected content</div>;
}
```

### Sign out:

```tsx
"use client";
import { signOut } from "next-auth/react";

<button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>;
```

## 🐛 Troubleshooting

### "Invalid Redirect URI" Error

✅ Make sure redirect URI in Google Console is exactly:

```
http://localhost:3000/api/auth/callback/google
```

(No trailing slash!)

### Prisma Generate EPERM Error (Windows)

✅ Close VS Code and dev server, then run in fresh PowerShell:

```bash
npx prisma generate
```

### Database Connection Error

✅ Check your DATABASE_URL:

- Correct username/password
- IP whitelist includes your IP (MongoDB Atlas)
- Database name is correct

### Session Not Persisting

✅ Check:

- NEXTAUTH_SECRET is set in `.env`
- NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

## 📚 Full Documentation

See `USER_AUTH_SETUP.md` for detailed documentation including:

- Future email/password authentication setup
- Production deployment guide
- Security best practices
- Advanced usage examples

## 🎯 Next Steps

1. ✅ Test Google sign in
2. ✅ Visit `/profile` to see user data
3. ✅ Try accessing protected routes
4. 📝 Customize the profile page
5. 🔐 Add role-based permissions (optional)
6. 📧 Implement email/password auth (optional)

## 🆘 Need Help?

Check these resources:

- NextAuth.js: https://next-auth.js.org/
- Prisma: https://www.prisma.io/docs
- MongoDB: https://docs.mongodb.com/

---

**Status:** ✅ Authentication system is ready to use!
