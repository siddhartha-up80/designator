# ✅ Authentication System Setup Checklist

## Pre-Setup Requirements

- [ ] Node.js 18+ installed
- [ ] Git installed (if using version control)
- [ ] Code editor (VS Code recommended)
- [ ] Web browser for testing

---

## Step 1: MongoDB Database Setup

### Option A: MongoDB Atlas (Recommended - Free)

- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Create free account
- [ ] Create new project
- [ ] Create cluster (M0 Free tier)
- [ ] Wait for cluster to be created (~2-3 minutes)
- [ ] Click "Connect"
- [ ] Choose "Connect your application"
- [ ] Copy connection string
- [ ] Save connection string for later

**Connection String Format:**

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/designator?retryWrites=true&w=majority
```

### Option B: Local MongoDB

- [ ] Install MongoDB Community Edition
- [ ] Start MongoDB service
- [ ] Use connection string: `mongodb://localhost:27017/designator`

**MongoDB Atlas Additional Steps:**

- [ ] Database Access → Add User with password
- [ ] Network Access → Add IP Address (0.0.0.0/0 for development)

---

## Step 2: Google OAuth Setup

- [ ] Go to https://console.cloud.google.com/
- [ ] Sign in with Google account
- [ ] Create new project (or select existing)
  - Project name: "Designator" (or your choice)
- [ ] Wait for project creation
- [ ] Select your project from dropdown

### Enable Google+ API:

- [ ] Go to "APIs & Services" → "Library"
- [ ] Search for "Google+ API"
- [ ] Click on "Google+ API"
- [ ] Click "Enable"

### Create OAuth Credentials:

- [ ] Go to "APIs & Services" → "Credentials"
- [ ] Click "Create Credentials" dropdown
- [ ] Select "OAuth client ID"
- [ ] Configure consent screen (if prompted):
  - [ ] User Type: External
  - [ ] App name: "Designator"
  - [ ] User support email: your email
  - [ ] Developer contact: your email
  - [ ] Save and Continue (skip optional fields)
  - [ ] Add test users if needed
- [ ] Application type: "Web application"
- [ ] Name: "Designator Web Client"
- [ ] Authorized redirect URIs:
  - [ ] Add: `http://localhost:3000/api/auth/callback/google`
  - [ ] (For production later): `https://yourdomain.com/api/auth/callback/google`
- [ ] Click "Create"
- [ ] **IMPORTANT**: Copy Client ID
- [ ] **IMPORTANT**: Copy Client Secret
- [ ] Save both for next step

---

## Step 3: Environment Variables Configuration

- [ ] Open your project in code editor
- [ ] Locate `.env` file in root directory (create if doesn't exist)
- [ ] Add/update the following variables:

```bash
# MongoDB Database
DATABASE_URL="[paste your MongoDB connection string here]"

# NextAuth Secret
NEXTAUTH_SECRET="[paste generated secret here]"

# NextAuth URL
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="[paste your Google Client ID here]"
GOOGLE_CLIENT_SECRET="[paste your Google Client Secret here]"
```

### Generate NEXTAUTH_SECRET:

**Windows PowerShell:**

- [ ] Run: `openssl rand -base64 32` (requires Git Bash or WSL)

**Mac/Linux:**

- [ ] Run: `openssl rand -base64 32` in terminal

**Or use online generator:**

- [ ] Visit: https://generate-secret.vercel.app/32
- [ ] Copy the generated secret

**Example .env file:**

```bash
DATABASE_URL="mongodb+srv://myuser:mypass123@cluster0.xxxxx.mongodb.net/designator?retryWrites=true&w=majority"
NEXTAUTH_SECRET="Jp8Kg7XsQ9fM2nV5tRyW3uE4pL1qH6vN8cB0aD2kF7jG9hS5"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="123456789-abcdefghijklmnop.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ"
```

- [ ] Save `.env` file
- [ ] Verify `.env` is listed in `.gitignore` (security)

---

## Step 4: Install Dependencies

- [ ] Open terminal in project root
- [ ] Run: `npm install --legacy-peer-deps`
- [ ] Wait for installation to complete
- [ ] Check for any errors (should complete successfully)

---

## Step 5: Prisma Database Setup

**⚠️ IMPORTANT: Close VS Code and any running dev servers before this step**

### Windows:

- [ ] Close VS Code completely
- [ ] Close any terminals running `npm run dev`
- [ ] Open new PowerShell in project root
- [ ] Run: `.\setup-prisma.bat`
- [ ] Follow prompts
- [ ] Verify success message

### Mac/Linux:

- [ ] Close any terminals running `npm run dev`
- [ ] Open new terminal in project root
- [ ] Run: `chmod +x setup-prisma.sh`
- [ ] Run: `./setup-prisma.sh`
- [ ] Verify success message

### Manual Setup (if script fails):

```bash
# Step 1: Generate Prisma Client
npx prisma generate

# Step 2: Push schema to database
npx prisma db push

# Step 3: (Optional) Open Prisma Studio
npx prisma studio
```

- [ ] Verify no errors in terminal
- [ ] Check that database was created in MongoDB Atlas

---

## Step 6: Start Development Server

- [ ] Open terminal in project root
- [ ] Run: `npm run dev`
- [ ] Wait for "Ready" message
- [ ] Note the URL (usually http://localhost:3000)

---

## Step 7: Test Authentication

### Basic Sign In Test:

- [ ] Open browser
- [ ] Navigate to: `http://localhost:3000/signin`
- [ ] Verify page loads correctly
- [ ] Click "Continue with Google" button
- [ ] Sign in with your Google account
- [ ] Grant permissions if prompted
- [ ] Verify redirect to `/home` page
- [ ] Check that you're signed in (user avatar in header)

### Profile Test:

- [ ] Click on your name/avatar in header
- [ ] Verify redirect to `/profile` page
- [ ] Check that your information displays:
  - [ ] Name
  - [ ] Email
  - [ ] Profile picture
  - [ ] User ID

### Sign Out Test:

- [ ] Click sign out button (in header or profile page)
- [ ] Verify redirect to home page
- [ ] Verify you're signed out (no user avatar in header)

### Protected Route Test:

- [ ] Ensure you're signed out
- [ ] Try to visit: `http://localhost:3000/home`
- [ ] Verify redirect to `/signin` page
- [ ] Sign in again
- [ ] Verify access to `/home` page

### Session Persistence Test:

- [ ] Sign in with Google
- [ ] Refresh the page (F5)
- [ ] Verify you remain signed in
- [ ] Close browser tab
- [ ] Open new tab to `http://localhost:3000`
- [ ] Verify you remain signed in

---

## Step 8: Database Verification (Optional)

### Using Prisma Studio:

- [ ] Open new terminal
- [ ] Run: `npx prisma studio`
- [ ] Browser opens to Prisma Studio
- [ ] Click on "User" model
- [ ] Verify your user record exists:
  - [ ] Email matches your Google email
  - [ ] Name matches your Google name
  - [ ] Image URL is present
- [ ] Click on "Account" model
- [ ] Verify OAuth account record exists:
  - [ ] Provider is "google"
  - [ ] Provider Account ID is present

### Using MongoDB Atlas:

- [ ] Log into MongoDB Atlas
- [ ] Go to your cluster
- [ ] Click "Browse Collections"
- [ ] Find "designator" database
- [ ] Check "User" collection
- [ ] Verify your user document exists

---

## Step 9: Review Implementation

- [ ] Read `QUICK_START_AUTH.md` for usage examples
- [ ] Read `USER_AUTH_SETUP.md` for detailed documentation
- [ ] Review `AUTH_IMPLEMENTATION_SUMMARY.md` for overview
- [ ] Check `src/auth.ts` to understand configuration
- [ ] Review `src/middleware.ts` to see route protection

---

## Troubleshooting Checklist

If something doesn't work, check:

### Sign In Issues:

- [ ] Google Console redirect URI is exactly: `http://localhost:3000/api/auth/callback/google`
- [ ] GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct in `.env`
- [ ] No extra spaces or quotes in `.env` values
- [ ] Browser cookies are enabled

### Database Issues:

- [ ] DATABASE_URL is correct in `.env`
- [ ] MongoDB cluster is running (Atlas)
- [ ] IP address is whitelisted (Atlas)
- [ ] Username and password are correct
- [ ] Prisma client was generated successfully

### Session Issues:

- [ ] NEXTAUTH_SECRET is set in `.env`
- [ ] NEXTAUTH_URL matches your domain
- [ ] Clear browser cookies and try again
- [ ] Check browser console for errors

### Build/Prisma Issues:

- [ ] All Node processes closed before running Prisma
- [ ] VS Code closed before running Prisma
- [ ] Ran `npx prisma generate` successfully
- [ ] No EPERM errors in terminal

---

## Production Deployment Checklist

When ready for production:

- [ ] Update `.env` for production:
  ```bash
  NEXTAUTH_URL="https://yourdomain.com"
  DATABASE_URL="your-production-mongodb-url"
  ```
- [ ] Add production redirect URI to Google Console:
  - `https://yourdomain.com/api/auth/callback/google`
- [ ] Set environment variables in hosting platform (Vercel/Netlify)
- [ ] Test authentication on production
- [ ] Update MongoDB IP whitelist if needed
- [ ] Enable HTTPS (required for secure cookies)

---

## ✅ Completion Checklist

You're done when:

- [x] MongoDB database is set up and accessible
- [x] Google OAuth is configured in Console
- [x] `.env` file has all required variables
- [x] Dependencies are installed
- [x] Prisma client is generated
- [x] Database schema is pushed
- [x] Development server runs without errors
- [x] You can sign in with Google
- [x] Session persists across refreshes
- [x] Protected routes redirect correctly
- [x] User information displays in profile
- [x] Sign out works correctly

---

## 🎉 Success!

If all items are checked, your authentication system is fully functional!

### What's Next?

1. Customize the profile page
2. Add user roles/permissions (optional)
3. Implement email/password auth (optional)
4. Add more OAuth providers (optional)
5. Deploy to production

### Need Help?

- Check the documentation files in the project
- Review NextAuth.js docs: https://next-auth.js.org/
- Check Prisma docs: https://www.prisma.io/docs
- MongoDB docs: https://docs.mongodb.com/

**Good luck with your Designator app! 🚀**
