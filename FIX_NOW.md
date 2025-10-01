# 🎯 IMMEDIATE ACTION: Fix Google OAuth Error

## ❌ Current Error

```
Error 400: redirect_uri_mismatch
Access blocked: inator's request is invalid
```

---

## ✅ SOLUTION (3 minutes)

### Step 1: Open Google Cloud Console

**Link:** https://console.cloud.google.com/apis/credentials

### Step 2: Find Your OAuth Client

Look for the OAuth 2.0 Client ID that starts with:

```
162467453875-...
```

Click on it to edit.

### Step 3: Add This Redirect URI

Copy and paste **EXACTLY** this:

```
http://localhost:3000/api/auth/callback/google
```

Paste it in the "Authorized redirect URIs" section.

### Step 4: Save

Click the **SAVE** button at the bottom.

### Step 5: Wait & Test

- Wait 2 minutes
- Clear browser cookies (or open incognito)
- Restart dev server: `npm run dev`
- Try signing in again

---

## 📋 Checklist

Before trying again, verify:

- [ ] Redirect URI is: `http://localhost:3000/api/auth/callback/google`
- [ ] No trailing slash at the end
- [ ] Using `http://` not `https://` for localhost
- [ ] Port is 3000
- [ ] Changes saved in Google Console
- [ ] Waited 2 minutes
- [ ] Cleared browser cookies
- [ ] Dev server restarted

---

## 🎬 Visual Guide

```
Google Cloud Console
└── APIs & Services
    └── Credentials
        └── OAuth 2.0 Client IDs
            └── 162467453875-nk9gi5bs4b5kdt7896ug6pvokndqetfa
                └── Edit (pencil icon)
                    └── Authorized redirect URIs
                        └── + ADD URI
                            └── Paste: http://localhost:3000/api/auth/callback/google
                                └── SAVE
```

---

## ⚠️ IMPORTANT

**Must be EXACTLY:**

```
http://localhost:3000/api/auth/callback/google
```

**NOT:**

- ❌ `http://localhost:3000/api/auth/callback/google/` (trailing slash)
- ❌ `https://localhost:3000/api/auth/callback/google` (https)
- ❌ `http://localhost/api/auth/callback/google` (missing port)
- ❌ `http://127.0.0.1:3000/api/auth/callback/google` (IP address)

---

## 🚨 If Still Not Working

### Option 1: Double-Check

1. Go back to Google Console
2. Verify the URI is there
3. Check for typos
4. Save again

### Option 2: Wait Longer

Sometimes Google takes 5-10 minutes to update

### Option 3: Create New Client

If nothing works, create a fresh OAuth client:

1. Delete the old one (or leave it)
2. Create new OAuth 2.0 Client ID
3. Add redirect URI correctly
4. Update .env with new credentials

---

## 📞 Next Steps After Fixing

Once the redirect URI is added correctly:

1. ✅ Sign in should work
2. ✅ You'll see Google account selection
3. ✅ Grant permissions
4. ✅ Redirect to /home
5. ✅ See your avatar in header

---

## 💡 Pro Tip

Add multiple URIs for different environments:

```
Development:
http://localhost:3000/api/auth/callback/google

Production (add later):
https://yourdomain.com/api/auth/callback/google
```

Both can exist in the same OAuth client!

---

**Fix this in Google Console, then try signing in again! 🚀**
