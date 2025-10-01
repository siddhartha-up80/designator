# 🔐 Authentication Flow Diagram

## User Sign In Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         User Authentication Flow                     │
└─────────────────────────────────────────────────────────────────────┘

1. USER VISITS SIGNIN PAGE
   │
   ├── URL: /signin
   └── Component: src/app/signin/page.tsx
       │
       └── Shows: "Continue with Google" button


2. USER CLICKS "CONTINUE WITH GOOGLE"
   │
   ├── Calls: signIn("google", { callbackUrl: "/home" })
   └── Redirects to: Google OAuth consent screen
       │
       └── User grants permissions


3. GOOGLE REDIRECTS BACK TO APP
   │
   ├── URL: /api/auth/callback/google?code=...
   └── Handler: src/app/api/auth/[...nextauth]/route.ts
       │
       └── NextAuth processes OAuth code


4. NEXTAUTH CREATES SESSION
   │
   ├── Configuration: src/auth.ts
   │
   ├── Callbacks Execute:
   │   ├── jwt() - Creates JWT token with user info
   │   └── session() - Adds user data to session
   │
   ├── Database Operations (via Prisma):
   │   ├── Creates/Updates User record
   │   └── Creates Account record (OAuth info)
   │
   └── Sets Cookie: next-auth.session-token (HTTP-only, secure)


5. USER REDIRECTED TO HOME
   │
   ├── URL: /home
   └── Middleware: src/middleware.ts
       │
       ├── Checks: JWT token in cookie
       └── Allows: Access to protected route


6. APP RENDERS WITH USER SESSION
   │
   ├── Layout: src/app/layout.tsx
   │   └── Wraps with: SessionProvider
   │
   ├── Header: src/components/header.tsx
   │   ├── Calls: useSession()
   │   └── Shows: User avatar and name
   │
   └── Any Page: Can access session
       ├── Server: const session = await auth()
       └── Client: const { user } = useAuth()


7. USER NAVIGATES FREELY
   │
   └── All routes protected by middleware
       │
       ├── Protected Routes: /home, /profile, /gallery, etc.
       │   └── Requires: Valid JWT token in cookie
       │
       └── Public Routes: /, /signin, /signup, /api/auth/*
           └── Accessible: Without authentication
```

---

## Protected Route Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Protected Route Access                          │
└─────────────────────────────────────────────────────────────────────┘

USER TRIES TO ACCESS /home
   │
   ├── Request passes through: src/middleware.ts
   │
   ├── Middleware checks:
   │   └── Is JWT token present and valid?
   │
   ├── IF YES (Authenticated):
   │   └── Allow access → User sees /home
   │
   └── IF NO (Not Authenticated):
       └── Redirect to /signin?callbackUrl=/home
           │
           └── After signin, redirect back to /home
```

---

## Sign Out Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         User Sign Out Flow                           │
└─────────────────────────────────────────────────────────────────────┘

1. USER CLICKS SIGN OUT BUTTON
   │
   └── Component: Header or Profile page


2. CALLS SIGNOUT FUNCTION
   │
   └── signOut({ callbackUrl: "/" })


3. NEXTAUTH PROCESSES SIGNOUT
   │
   ├── Clears: JWT cookie
   ├── Fires: signOut event
   └── Redirects: To callbackUrl (/)


4. USER REDIRECTED TO HOME
   │
   ├── Session: Cleared
   └── Access: Only public routes
       │
       └── Trying protected routes → Redirect to /signin
```

---

## Session Persistence Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Session Persistence                             │
└─────────────────────────────────────────────────────────────────────┘

USER CLOSES BROWSER
   │
   └── JWT token: Stored in HTTP-only cookie (persists)


USER REOPENS BROWSER AND VISITS SITE
   │
   ├── Browser sends: Cookie with JWT token
   │
   ├── Middleware checks: Token validity
   │
   ├── If valid:
   │   └── User automatically logged in
   │
   └── If expired:
       └── User redirected to /signin
```

---

## Database Schema Relationships

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Database Schema                                 │
└─────────────────────────────────────────────────────────────────────┘

User
├── id (Primary Key)
├── name
├── email (Unique)
├── emailVerified
├── image
├── password (Optional - for email auth)
├── createdAt
├── updatedAt
│
├─── Has Many ───┐
│                │
│                ├── Account (OAuth providers)
│                │   ├── provider: "google"
│                │   ├── providerAccountId
│                │   ├── access_token
│                │   ├── refresh_token
│                │   └── userId → User.id
│                │
│                └── Session (Optional - we use JWT)
│                    ├── sessionToken
│                    ├── expires
│                    └── userId → User.id
```

---

## File Structure & Responsibilities

```
┌─────────────────────────────────────────────────────────────────────┐
│                      File Structure                                  │
└─────────────────────────────────────────────────────────────────────┘

src/
│
├── auth.ts
│   ├── Configures: NextAuth providers (Google)
│   ├── Defines: Callbacks (jwt, session, redirect)
│   ├── Sets: Session strategy (JWT)
│   └── Exports: auth, signIn, signOut, handlers
│
├── middleware.ts
│   ├── Protects: All routes except public ones
│   ├── Checks: JWT token validity
│   └── Redirects: Unauthorized users to /signin
│
├── app/
│   ├── layout.tsx
│   │   └── Wraps app with SessionProvider
│   │
│   ├── signin/page.tsx
│   │   ├── Shows: Google sign in button
│   │   └── Calls: signIn("google")
│   │
│   ├── signup/page.tsx
│   │   ├── Shows: Google sign up button
│   │   └── Calls: signIn("google")
│   │
│   ├── profile/page.tsx
│   │   ├── Shows: User information
│   │   └── Sign out button
│   │
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       │   └── Exports: GET, POST handlers
│       │
│       └── user/me/route.ts
│           └── Returns: Current user info
│
├── components/
│   ├── session-provider.tsx
│   │   └── Client-side SessionProvider wrapper
│   │
│   └── header.tsx
│       ├── Shows: User avatar
│       └── Sign out button
│
├── hooks/
│   └── use-auth.ts
│       └── Custom hook: useAuth()
│           ├── Returns: user, isAuthenticated, isLoading
│           └── Uses: useSession() internally
│
└── types/
    └── next-auth.d.ts
        └── Extends NextAuth types with user.id
```

---

## API Endpoints

```
┌─────────────────────────────────────────────────────────────────────┐
│                          API Routes                                  │
└─────────────────────────────────────────────────────────────────────┘

GET /api/auth/signin
├── Shows: Sign in page
└── Providers: Google

GET /api/auth/callback/google
├── Handles: OAuth callback from Google
├── Creates: User session
└── Redirects: To callbackUrl

POST /api/auth/signout
├── Clears: Session cookie
└── Redirects: To home

GET /api/auth/session
├── Returns: Current session data
└── Used by: useSession() hook

GET /api/user/me
├── Protected: Requires authentication
├── Returns: Current user info
└── Status: 401 if not authenticated
```

---

## Environment Variables Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Environment Variables                             │
└─────────────────────────────────────────────────────────────────────┘

.env file
│
├── DATABASE_URL
│   └── Used by: Prisma → MongoDB connection
│
├── NEXTAUTH_SECRET
│   └── Used by: NextAuth → JWT encryption
│
├── NEXTAUTH_URL
│   └── Used by: NextAuth → Base URL for redirects
│
├── GOOGLE_CLIENT_ID
│   └── Used by: Google provider → OAuth
│
└── GOOGLE_CLIENT_SECRET
    └── Used by: Google provider → OAuth
```

---

## Cookie Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Cookie Details                               │
└─────────────────────────────────────────────────────────────────────┘

Cookie Name: next-auth.session-token

Attributes:
├── HttpOnly: true (JavaScript can't access)
├── Secure: true (HTTPS only in production)
├── SameSite: lax (CSRF protection)
├── Path: /
└── Max-Age: 30 days (default)

Contents (JWT):
├── Header: { alg: "HS256", typ: "JWT" }
├── Payload:
│   ├── sub: user.id
│   ├── email: user.email
│   ├── name: user.name
│   ├── picture: user.image
│   ├── iat: issued at timestamp
│   └── exp: expiration timestamp
└── Signature: HMACSHA256(secret)
```

---

## Security Measures

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Security Features                               │
└─────────────────────────────────────────────────────────────────────┘

✅ HTTP-Only Cookies
   └── JavaScript cannot access session token

✅ JWT Encryption
   └── Tokens signed with NEXTAUTH_SECRET

✅ CSRF Protection
   └── Built-in NextAuth CSRF tokens

✅ Secure Cookies
   └── HTTPS enforced in production

✅ Route Protection
   └── Middleware checks all protected routes

✅ Token Expiration
   └── Automatic session timeout

✅ OAuth Security
   └── Google handles password security

✅ Database Security
   └── MongoDB with authentication

✅ Environment Variables
   └── Secrets not in source code
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                       Error Handling                                 │
└─────────────────────────────────────────────────────────────────────┘

OAuth Error (Invalid Credentials)
└── NextAuth → Redirect to /signin?error=OAuthCallback

Database Error
└── Prisma throws → Catch in API → Return 500

Invalid Token
└── Middleware → Redirect to /signin

Expired Session
└── useSession returns null → Show login prompt

Network Error
└── Try/catch in signIn → Show error message

Missing Environment Variables
└── NextAuth throws error at startup
```

---

This diagram shows the complete flow of authentication in your Designator app!
