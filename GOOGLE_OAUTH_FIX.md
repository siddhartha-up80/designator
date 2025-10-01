# 🔧 Google OAuth Redirect URI Fix

## Error: redirect_uri_mismatch

This error occurs when the redirect URI configured in Google Cloud Console doesn't match what your app is sending.

---

## ✅ Quick Fix Checklist

### 1. Go to Google Cloud Console

- Visit: https://console.cloud.google.com/apis/credentials
- Select your project

### 2. Find Your OAuth Client

- Click on the OAuth 2.0 Client ID that starts with: `162467453875-...`
- This is the client ID in your .env file

### 3. Add Correct Redirect URI

In the "Authorized redirect URIs" section, add:

```
http://localhost:3000/api/auth/callback/google
```

**EXACTLY as shown above** ⚠️

### 4. Common Mistakes

❌ **WRONG:**

```
http://localhost:3000/api/auth/callback/google/   ← Trailing slash
https://localhost:3000/api/auth/callback/google   ← HTTPS (should be HTTP for localhost)
http://localhost/api/auth/callback/google         ← Missing port
http://127.0.0.1:3000/api/auth/callback/google   ← IP instead of localhost
```

✅ **CORRECT:**

```
http://localhost:3000/api/auth/callback/google
```

### 5. Save and Wait

- Click "SAVE" button
- Wait 1-2 minutes for changes to propagate

### 6. Clear Cache and Test

```bash
# Close all browser tabs
# Clear browser cookies OR use incognito mode
# Restart dev server
npm run dev

# Try signing in again
```

---

## 🎯 Step-by-Step Screenshots Guide

### Step 1: Access Credentials

1. Go to https://console.cloud.google.com/
2. Select your project (if prompted)
3. Navigate to: **APIs & Services** → **Credentials**

### Step 2: Edit OAuth Client

1. Look for "OAuth 2.0 Client IDs" section
2. Find your client (starts with `162467453875-`)
3. Click the **pencil icon** (Edit) or click the name

### Step 3: Add Redirect URI

1. Scroll to "Authorized redirect URIs"
2. Click **"+ ADD URI"**
3. Paste: `http://localhost:3000/api/auth/callback/google`
4. Press Enter
5. Click **"SAVE"** at the bottom

### Step 4: Verify

After saving, you should see:

```
Authorized redirect URIs
  http://localhost:3000/api/auth/callback/google  ✓
```

---

## 🔍 Troubleshooting

### Error Still Appears?

**Wait Time:**

- Google OAuth changes can take 1-5 minutes to propagate
- Try waiting a bit longer

**Clear Everything:**

```bash
# 1. Clear browser data
- Open browser settings
- Clear cookies and cache
- Or use incognito/private mode

# 2. Restart dev server
Ctrl+C (stop server)
npm run dev
```

**Check Your .env File:**
Make sure these match your Google Console:

```bash
GOOGLE_CLIENT_ID=162467453875-nk9gi5bs4b5kdt7896ug6pvokndqetfa.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NEXTAUTH_URL=http://localhost:3000
```

**Verify Port Number:**

- Your dev server should run on port 3000
- Check terminal output: `Local: http://localhost:3000`
- If different, update redirect URI to match

---

## 🚀 For Production Deployment

When you deploy to production, add another redirect URI:

```
https://yourdomain.com/api/auth/callback/google
```

**Note:** Production uses `https://` (not `http://`)

---

## 📱 Multiple Environments

You can have multiple redirect URIs for different environments:

```
Development:
  http://localhost:3000/api/auth/callback/google

Staging:
  https://staging.yourdomain.com/api/auth/callback/google

Production:
  https://yourdomain.com/api/auth/callback/google
```

All can be added to the same OAuth client.

---

## 🆘 Still Not Working?

### Double-Check Everything:

1. ✅ Redirect URI is exactly: `http://localhost:3000/api/auth/callback/google`
2. ✅ No extra spaces or characters
3. ✅ Saved in Google Console
4. ✅ Waited 2-3 minutes
5. ✅ Cleared browser cookies
6. ✅ Restarted dev server
7. ✅ Using correct Google account (the one that owns the project)

### Create New OAuth Client (Last Resort):

If nothing works, create a new OAuth client:

1. Go to Google Cloud Console → Credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "Designator Development"
5. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Create
7. Copy new Client ID and Secret
8. Update your .env file
9. Restart dev server

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Clicking "Continue with Google" opens Google sign-in
2. ✅ You see your Google accounts to choose from
3. ✅ No "invalid request" error
4. ✅ After selecting account, it asks for permissions
5. ✅ After granting permissions, redirects to /home
6. ✅ You see your avatar in the header

---

## 📝 Quick Reference

**Redirect URI Format:**

```
{protocol}://{host}:{port}/api/auth/callback/{provider}
```

**For localhost:**

```
http://localhost:3000/api/auth/callback/google
```

**For production:**

```
https://yourdomain.com/api/auth/callback/google
```

---

**After fixing this, your Google sign-in should work perfectly! 🎉**
