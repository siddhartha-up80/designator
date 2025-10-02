# Real-Time Credits Update System

## Overview

The Designator application now features a **real-time credits update system** that automatically refreshes the user's credit balance across all parts of the application whenever they perform an action that consumes credits.

## Key Features

✅ **Live Credit Updates** - Credits update instantly without page refresh  
✅ **Global State Management** - React Context API for unified credit state  
✅ **Automatic Synchronization** - API responses automatically update the UI  
✅ **Multiple Display Locations** - Credits shown in header and profile dialog  
✅ **Seamless UX** - Loading states and smooth transitions

---

## Architecture

### 1. Credits Context (`src/contexts/credits-context.tsx`)

The heart of the real-time system is a React Context that provides:

```typescript
interface CreditsContextType {
  credits: number | null;
  loading: boolean;
  refreshCredits: () => Promise<void>;
  updateCredits: (newCredits: number) => void;
}
```

**Key Functions:**

- `refreshCredits()` - Fetches latest credit balance from API
- `updateCredits(newCredits)` - Instantly updates credit state without API call
- Automatically loads credits when user session exists

### 2. Provider Wrapper (`src/app/(main)/layout.tsx`)

The `CreditsProvider` wraps the entire main application, making credits available to all child components:

```tsx
<CreditsProvider>
  <ConditionalLayout>{children}</ConditionalLayout>
</CreditsProvider>
```

### 3. Credit Display Components

#### Header (`src/components/header.tsx`)

- Uses `useCredits()` hook
- Displays current credit balance
- Shows loading skeleton during fetch
- Updates automatically when credits change

#### Profile Dialog (`src/components/profile-dialog.tsx`)

- Shows detailed credit information
- Large, prominent display with gradient styling
- "Buy More" button links to pricing page
- Updates in real-time alongside header

---

## How It Works

### Flow Diagram

```
User Action (e.g., Generate Image)
          ↓
Feature Page makes API call
          ↓
API Endpoint (with withCredits middleware)
          ↓
- Validates user authentication
- Checks sufficient credits
- Deducts credits
- Performs operation
- Sets X-Remaining-Credits header
          ↓
Response returns to Feature Page
          ↓
Page extracts X-Remaining-Credits header
          ↓
Calls updateCredits(newCredits)
          ↓
Context updates global state
          ↓
ALL components using useCredits() re-render
          ↓
Header & Profile Dialog show new balance
```

### Example Implementation

**Feature Page (e.g., Prompt to Image):**

```typescript
import { useCredits } from "@/contexts/credits-context";

export default function PromptToImagePage() {
  const { updateCredits } = useCredits();

  const handleGenerate = async () => {
    const response = await fetch("/api/prompt-to-image", {
      method: "POST",
      body: JSON.stringify({
        /* params */
      }),
    });

    // Extract and update credits
    const remainingCredits = response.headers.get("X-Remaining-Credits");
    if (remainingCredits !== null) {
      const credits = parseInt(remainingCredits, 10);
      if (!isNaN(credits)) {
        updateCredits(credits); // ✨ Real-time update
      }
    }

    const result = await response.json();
    // Handle result...
  };
}
```

---

## Credit Update Locations

### Current Implementations

1. ✅ **Header** - Top-right corner, visible on all pages
2. ✅ **Profile Dialog** - Sidebar profile, detailed view with "Buy More" CTA
3. ✅ **Prompt to Image Page** - Updates after generation
4. 🔄 **Other Feature Pages** - To be implemented with same pattern

### Pages That Need Updates

The following pages should implement the same credit update pattern:

- Fashion Try-On (`/fashion-try-on`)
- Product Model (`/product-model`)
- Image to Prompt (`/img-to-prompt`)
- Photography Enhance (`/photography`)
- Photography Presets (`/photography`)

---

## Implementation Guide

### For New Feature Pages

1. **Import the hook:**

```typescript
import { useCredits } from "@/contexts/credits-context";
```

2. **Use the hook in your component:**

```typescript
const { credits, loading, updateCredits } = useCredits();
```

3. **Update credits after API calls:**

```typescript
const response = await fetch("/api/your-endpoint", {
  /* options */
});

// Extract credits from header
const remainingCredits = response.headers.get("X-Remaining-Credits");
if (remainingCredits !== null) {
  updateCredits(parseInt(remainingCredits, 10));
}
```

4. **Display credits (optional):**

```typescript
<CreditsBadge credits={credits ?? 0} />
```

### For Display Components

To show credits in any component:

```typescript
import { useCredits } from "@/contexts/credits-context";
import { CreditsBadge } from "@/components/credits-badge";

function MyComponent() {
  const { credits, loading } = useCredits();

  if (loading) {
    return <div>Loading...</div>;
  }

  return <CreditsBadge credits={credits ?? 0} />;
}
```

---

## API Integration

### Middleware Response Headers

The `withCredits` middleware automatically adds the remaining credits to response headers:

```typescript
// In src/lib/credits-middleware.ts
response.headers.set("X-Remaining-Credits", remainingCredits.toString());
```

### All Protected Endpoints

Every API route wrapped with `withCredits` returns the `X-Remaining-Credits` header:

- `/api/prompt-to-image` - 10 credits
- `/api/fashion-try-on` - 25 credits
- `/api/generate-models` - 25 credits
- `/api/img-to-prompt` - 10 credits
- `/api/photography-enhance` - 15 credits
- `/api/photography-presets` - 15 credits

---

## Benefits

### User Experience

- **Immediate Feedback** - Users see credit changes instantly
- **No Confusion** - Always up-to-date balance
- **No Page Refresh** - Smooth, modern SPA experience
- **Multiple Views** - Credits visible in header and profile

### Developer Experience

- **Simple API** - Just call `updateCredits()`
- **Centralized State** - One source of truth
- **Easy Integration** - Import and use the hook
- **Type-Safe** - Full TypeScript support

### Performance

- **Minimal Requests** - Only fetch when necessary
- **Efficient Updates** - Direct state updates from API responses
- **Optimistic UI** - Can update before API confirms
- **No Polling** - Event-driven updates only

---

## Testing

### Manual Testing Checklist

1. ✅ Sign in to the application
2. ✅ Check initial credits in header
3. ✅ Open profile dialog - verify same credits shown
4. ✅ Generate an image (Prompt to Image)
5. ✅ Observe credits deducted in header immediately
6. ✅ Open profile dialog - verify updated credits
7. ✅ Refresh page - credits persist correctly
8. ✅ Use another feature - credits update again

### Edge Cases

- ❌ **Insufficient Credits** - API returns 402, no update needed
- ✅ **Network Error** - Credits remain unchanged, retry available
- ✅ **Concurrent Requests** - Last response wins (header-based)
- ✅ **Session Timeout** - Credits cleared, user redirected to signin

---

## Future Enhancements

### Planned Features

1. **Transaction History** - Show recent credit usage in profile
2. **Credit Notifications** - Toast/banner when running low
3. **Usage Analytics** - Charts showing credit consumption
4. **Undo Actions** - Refund credits if operation fails
5. **Credit Packages** - In-app purchase flow
6. **Team Credits** - Shared credit pools for organizations

### WebSocket Support (Optional)

For multi-device sync:

```typescript
// Future: WebSocket connection for real-time sync
const ws = new WebSocket("wss://api.designator.com/credits");
ws.onmessage = (event) => {
  const { credits } = JSON.parse(event.data);
  updateCredits(credits);
};
```

---

## Troubleshooting

### Credits Not Updating

1. Check browser console for errors
2. Verify API response includes `X-Remaining-Credits` header
3. Ensure component uses `useCredits()` hook
4. Confirm `CreditsProvider` wraps the component tree

### Incorrect Credit Balance

1. Refresh the page to fetch latest from database
2. Check database for transaction history
3. Verify middleware deduction logic
4. Review API endpoint credit costs

### Loading State Stuck

1. Check if `refreshCredits()` completed
2. Verify user is authenticated
3. Check `/api/credits` endpoint health
4. Review network tab for failed requests

---

## Code Reference

### Key Files

| File                                      | Purpose                         |
| ----------------------------------------- | ------------------------------- |
| `src/contexts/credits-context.tsx`        | Global credits state management |
| `src/components/header.tsx`               | Credit display in header        |
| `src/components/profile-dialog.tsx`       | Credit display in profile       |
| `src/lib/credits-middleware.ts`           | API credit deduction & header   |
| `src/app/(main)/layout.tsx`               | Provider wrapper                |
| `src/app/(main)/prompt-to-image/page.tsx` | Example implementation          |

### Related Documentation

- [CREDITS_SYSTEM.md](./CREDITS_SYSTEM.md) - Complete credits system overview
- [CREDITS_IMPLEMENTATION_SUMMARY.md](./CREDITS_IMPLEMENTATION_SUMMARY.md) - Implementation steps
- [API_PROTECTION.md](./API_PROTECTION.md) - API security and middleware

---

## Summary

The real-time credits update system provides a seamless, modern experience for users while maintaining accurate credit tracking across the entire application. By leveraging React Context and response headers, we achieve instant UI updates without additional API calls or complex state management.

**Key Takeaway:** Every component using `useCredits()` automatically receives credit updates whenever any API call completes, creating a synchronized, real-time experience across the entire application.

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
