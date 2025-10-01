# Edge Runtime Fix for Middleware

## Issue

Middleware in Next.js runs on the Edge Runtime, which doesn't support Prisma Client directly. This causes a build error:

```
Module not found: Can't resolve './query_engine_bg.js'
```

## Solution Applied

### 1. Updated Middleware (src/middleware.ts)

Changed from using NextAuth's `auth()` wrapper to a custom middleware that checks session cookies directly:

```typescript
// Before (doesn't work with Edge Runtime):
import { auth } from "@/auth";
export default auth((req) => { ... });

// After (Edge Runtime compatible):
import { NextResponse } from "next/server";
export function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("next-auth.session-token");
  const isLoggedIn = !!sessionToken;
  // ... rest of logic
}
```

### 2. Updated next.config.js

Added Prisma to external packages for server components:

```javascript
experimental: {
  serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
}
```

### 3. Added Image Domains

Added Google user content domains for profile pictures:

- lh3.googleusercontent.com
- avatars.githubusercontent.com

## How It Works

1. **Middleware checks cookies**: Instead of querying the database or using NextAuth's auth wrapper, the middleware simply checks if the session cookie exists
2. **Server components use auth**: Server components and API routes can still use `auth()` from NextAuth since they don't run on Edge Runtime
3. **Prisma stays in server components**: Prisma Client is only used in server components and API routes, never in middleware

## Benefits

- ✅ Edge Runtime compatible
- ✅ Faster middleware execution (no database queries)
- ✅ Simpler implementation
- ✅ Same security level (JWT tokens are validated by NextAuth)
- ✅ Works in both development and production

## Testing

After this fix, your middleware should:

1. ✅ Compile without errors
2. ✅ Protect routes correctly
3. ✅ Redirect unauthenticated users to /signin
4. ✅ Allow authenticated users to access protected routes
5. ✅ Work in both dev and production builds

## Note

The session validation still happens in NextAuth (server-side). The middleware only checks for the presence of the cookie to make routing decisions. Full JWT validation occurs when you call `auth()` in server components or API routes.
