# Credits System - Quick Start Guide

## 🚀 Getting Started

### 1. Database Setup

Update your database with the new schema:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 2. Start the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## ✨ Features Overview

### For Users

1. **Sign Up**: Get 50 free credits automatically
2. **Use Features**: Each feature has a clear credit cost displayed
3. **Track Usage**: View credit balance in header at all times
4. **Upgrade**: Click upgrade button when credits run low

### Credit Costs at a Glance

| Feature           | Credits | Type              |
| ----------------- | ------- | ----------------- |
| Fashion Try-On    | 25      | Photo Generation  |
| Product Model     | 25      | Photo Generation  |
| Prompt to Image   | 10      | Text Prompt       |
| Image to Prompt   | 10      | Text Prompt       |
| Photo Enhancement | 15      | Photo Enhancement |
| Style Presets     | 15      | Photo Enhancement |

## 🎯 User Experience Flow

```
┌─────────────────┐
│   User Signs    │
│      Up         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Receives 50    │
│  Free Credits   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Explores       │
│  Features       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Uses Feature   │
│  (Credits       │
│   Deducted)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Sees Updated   │
│  Balance in     │
│  Header         │
└────────┬────────┘
         │
         ▼
    ┌───┴───┐
    │       │
    ▼       ▼
┌────────┐ ┌────────┐
│Credits │ │Upgrade │
│ Low?   │ │  Plan  │
└────────┘ └────────┘
```

## 💻 For Developers

### Using the Credits Service

```typescript
import { creditsService, CREDIT_COSTS } from "@/lib/credits-service";

// Check credits
const credits = await creditsService.getCredits(userId);

// Check if user has enough
const hasEnough = await creditsService.hasEnoughCredits(
  userId,
  CREDIT_COSTS.PHOTO_GENERATION
);

// Deduct credits
const result = await creditsService.deductCredits(
  userId,
  CREDIT_COSTS.PHOTO_GENERATION,
  "PHOTO_GENERATION",
  "Fashion Try-On Generation"
);
```

### Protecting API Routes

```typescript
import { withCredits } from "@/lib/credits-middleware";
import { CREDIT_COSTS } from "@/lib/credits-service";

export async function POST(request: NextRequest) {
  return withCredits(
    request,
    CREDIT_COSTS.PHOTO_GENERATION,
    "PHOTO_GENERATION",
    "Feature Description",
    async (userId: string) => {
      // Your API logic here
      return NextResponse.json({ success: true });
    }
  );
}
```

### Adding Credit Badges to UI

```tsx
import { FeatureCreditCost } from "@/components/credits-badge";
import { CREDIT_COSTS } from "@/lib/credits-service";

<h1 className="flex items-center gap-2">
  Feature Name
  <FeatureCreditCost cost={CREDIT_COSTS.PHOTO_GENERATION} size="md" />
</h1>;
```

## 🧪 Testing

### Test New User Flow

1. Sign up with a new account
2. Check header shows 50 credits
3. Use a feature
4. Verify credits are deducted
5. Check transaction history at `/api/credits/transactions`

### Test Insufficient Credits

1. Use features until credits run low
2. Try to use a feature without enough credits
3. Verify error message shows:
   - Required credits
   - Available credits
   - Upgrade suggestion

### Test Credit Display

1. Open any feature page
2. Verify credit cost badge appears next to title
3. Check header shows current balance
4. Verify loading states work properly

## 📊 Monitoring

### Check Transaction History

```bash
# Using MongoDB shell or Compass
db.CreditTransaction.find({ userId: "user_id_here" })
  .sort({ createdAt: -1 })
  .limit(10)
```

### View User Credits

```bash
db.User.find({ email: "user@example.com" }, { credits: 1, plan: 1 })
```

## 🔧 Configuration

### Adjust Credit Costs

Edit `src/lib/credits-service.ts`:

```typescript
export const CREDIT_COSTS = {
  PHOTO_GENERATION: 25, // Change these values
  TEXT_PROMPT: 10, // as needed
  PHOTO_ENHANCEMENT: 15,
} as const;
```

### Modify Plan Credits

```typescript
export const PLAN_CONFIGS = {
  FREE: {
    name: "Free",
    credits: 50, // Adjust initial credits
    price: 0,
  },
  PRO: {
    name: "Pro",
    credits: 500, // Monthly credits
    price: 29,
  },
  ENTERPRISE: {
    name: "Enterprise",
    credits: -1, // -1 means unlimited
    price: 99,
  },
} as const;
```

## 🎨 Customization

### Update Badge Colors

Edit `src/components/credits-badge.tsx` to change the appearance:

```tsx
// Current: Amber gradient
className = "bg-amber-50 text-amber-700 border-amber-200";

// Alternative: Blue gradient
className = "bg-blue-50 text-blue-700 border-blue-200";

// Alternative: Purple gradient
className = "bg-purple-50 text-purple-700 border-purple-200";
```

## 📱 API Reference

### GET /api/credits

Get user's credit balance

**Response:**

```json
{
  "credits": 50,
  "plan": "FREE",
  "formatted": "50"
}
```

### GET /api/credits/transactions?limit=50

Get transaction history

**Response:**

```json
{
  "transactions": [
    {
      "id": "...",
      "amount": -25,
      "type": "PHOTO_GENERATION",
      "description": "Fashion Try-On Generation",
      "createdAt": "2025-10-02T..."
    }
  ]
}
```

## ⚠️ Error Codes

| Code | Description          | Action                  |
| ---- | -------------------- | ----------------------- |
| 401  | Unauthorized         | User must sign in       |
| 402  | Insufficient Credits | User needs more credits |
| 404  | User Not Found       | Check authentication    |
| 500  | Server Error         | Check logs              |

## 🎓 Best Practices

1. ✅ Always show credit costs upfront
2. ✅ Use descriptive transaction messages
3. ✅ Handle errors gracefully
4. ✅ Log all credit operations
5. ✅ Test thoroughly before deployment
6. ✅ Monitor credit usage patterns
7. ✅ Keep pricing transparent

## 🆘 Troubleshooting

### Credits Not Showing?

- Check if user is authenticated
- Verify database connection
- Check browser console for errors

### Credits Not Deducting?

- Verify API route uses `withCredits` middleware
- Check database transaction logs
- Review server logs for errors

### New Users Not Getting Credits?

- Check auth event handler in `src/auth.ts`
- Verify `initializeNewUserCredits` is called
- Check database for SIGNUP_BONUS transactions

## 📚 Additional Resources

- Full Documentation: `CREDITS_SYSTEM.md`
- Implementation Summary: `CREDITS_IMPLEMENTATION_SUMMARY.md`
- Prisma Schema: `prisma/schema.prisma`

## 🎉 You're All Set!

The credits system is fully functional and ready to use. Start testing and collecting user feedback to refine the pricing and user experience.

---

**Need Help?** Check the logs and documentation, or review the transaction history to debug issues.
