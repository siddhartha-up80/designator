# User Management System - Setup Guide

## Overview

This guide walks you through setting up the complete user management system with NextAuth.js v5, Google OAuth, MongoDB with Prisma, and cookie-based sessions.

## Features Implemented

- ✅ NextAuth.js v5 (latest beta version) with Google OAuth
- ✅ MongoDB with Prisma ORM
- ✅ Cookie-based JWT sessions (no database sessions)
- ✅ Protected routes with middleware
- ✅ User profile page
- ✅ Sign in/Sign up pages with Google OAuth
- ✅ Email/password authentication UI (commented out for future implementation)

## Prerequisites

1. Node.js 18+ installed
2. MongoDB database (MongoDB Atlas recommended for cloud)
3. Google Cloud Console account

## Step 1: Set Up MongoDB Database

### Option A: MongoDB Atlas (Recommended - Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<username>`, `<password>`, and `<database>` with your values

### Option B: Local MongoDB

```bash
# Install MongoDB locally
# Then use connection string:
mongodb://localhost:27017/designator
```

## Step 2: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://your-domain.com/api/auth/callback/google`
   - Click "Create"
5. Copy the Client ID and Client Secret

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Update the following variables in `.env`:

```bash
# MongoDB Connection String
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/designator?retryWrites=true&w=majority"

# NextAuth Secret (generate using: openssl rand -base64 32)
NEXTAUTH_SECRET="your_generated_secret_here"

# Base URL
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### Generate NEXTAUTH_SECRET:

```bash
# On Linux/Mac:
openssl rand -base64 32

# Or use online generator:
# https://generate-secret.vercel.app/32
```

## Step 4: Install Dependencies

```bash
npm install --legacy-peer-deps
```

## Step 5: Set Up Database with Prisma

1. Generate Prisma Client:

```bash
npx prisma generate
```

2. Push the schema to MongoDB:

```bash
npx prisma db push
```

3. (Optional) Open Prisma Studio to view your database:

```bash
npx prisma studio
```

## Step 6: Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Testing the Authentication Flow

1. Go to `http://localhost:3000/signin`
2. Click "Continue with Google"
3. Sign in with your Google account
4. You should be redirected to `/home` after successful authentication
5. Visit `/profile` to see your user information
6. Try accessing protected routes - you should be redirected to signin if not authenticated

## File Structure

```
src/
├── auth.ts                          # NextAuth configuration
├── middleware.ts                    # Route protection middleware
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts         # NextAuth API route handler
│   ├── signin/
│   │   └── page.tsx                 # Sign in page (Google OAuth only)
│   ├── signup/
│   │   └── page.tsx                 # Sign up page (Google OAuth only)
│   └── profile/
│       └── page.tsx                 # User profile page
├── components/
│   └── session-provider.tsx        # Client-side session provider
├── hooks/
│   └── use-auth.ts                 # Custom authentication hook
└── types/
    └── next-auth.d.ts              # TypeScript definitions for NextAuth
```

## Usage Examples

### Protect a Page (Server Component)

```tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return <div>Protected content for {session.user.name}</div>;
}
```

### Check Authentication (Client Component)

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

### Sign Out

```tsx
"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
  );
}
```

### Get User in API Route

```tsx
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user: session.user });
}
```

## Database Models

The Prisma schema includes the following models:

- **User**: Stores user information (id, name, email, image, password)
- **Account**: Stores OAuth provider information (linked to User)
- **Session**: Optional session storage (we use JWT cookies instead)
- **VerificationToken**: For email verification (future feature)

## Cookie-Based Sessions

By default, this setup uses JWT tokens stored in secure HTTP-only cookies:

- No session data stored in the database
- Faster performance
- Reduced database queries
- Session data in the JWT token
- Secure and httpOnly flags enabled

## Future Enhancements

To enable email/password authentication:

1. Uncomment the form sections in `signin/page.tsx` and `signup/page.tsx`
2. Add Credentials provider to `src/auth.ts`:

```typescript
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Add to providers array:
Credentials({
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user || !user.password) return null;

    const isValid = await bcrypt.compare(credentials.password, user.password);

    if (!isValid) return null;

    return user;
  },
});
```

3. Create signup API route to hash passwords and create users

## Troubleshooting

### "Invalid Redirect URI" Error

- Make sure your redirect URI in Google Console matches exactly
- Format: `http://localhost:3000/api/auth/callback/google`
- No trailing slashes

### Database Connection Issues

- Check your DATABASE_URL is correct
- Ensure MongoDB cluster allows connections from your IP
- Verify username/password are correct

### NextAuth Session Not Working

- Clear browser cookies
- Check NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use strong NEXTAUTH_SECRET** - Generate with `openssl rand -base64 32`
3. **Enable HTTPS in production** - Required for secure cookies
4. **Rotate secrets regularly** - Update NEXTAUTH_SECRET periodically
5. **Validate user input** - Always validate data on the server side

## Production Deployment

1. Update environment variables:

```bash
NEXTAUTH_URL="https://your-domain.com"
DATABASE_URL="your-production-mongodb-url"
```

2. Add production redirect URI to Google Console:

```
https://your-domain.com/api/auth/callback/google
```

3. Ensure your MongoDB cluster allows connections from your deployment platform

4. Deploy to Vercel/Netlify/Your preferred platform

## Support

For issues or questions:

- NextAuth.js docs: https://next-auth.js.org/
- Prisma docs: https://www.prisma.io/docs
- MongoDB docs: https://docs.mongodb.com/
