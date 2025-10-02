# Credits System Implementation

## Overview

Designator now includes a comprehensive credits-based system for monetization. Every user starts with **50 free credits** upon signup, and different features consume different amounts of credits.

## Credit Costs

### Photo Generation (25 credits)

- **Fashion Try-On**: Generate AI model images wearing specific garments
- **Product Model Generator**: Create professional model photos with products

### Text Prompt Operations (10 credits)

- **Prompt to Image**: Generate images from text descriptions
- **Image to Prompt**: Extract detailed text prompts from images

### Photo Enhancement (15 credits)

- **Photography AI Enhancement**: Apply AI-powered enhancements to photos
- **Photography Style Presets**: Transform photos with professional style presets

## Subscription Plans

### Free Plan

- **50 credits** upon signup
- Pay-as-you-go for additional credits
- Access to all features

### Pro Plan (Coming Soon)

- **500 credits/month**
- Priority processing
- Advanced features
- $29/month

### Enterprise Plan (Coming Soon)

- **Unlimited credits**
- Dedicated support
- Custom integrations
- White-label options
- $99/month

## Technical Implementation

### Database Schema

```prisma
model User {
  id       String  @id @default(auto()) @map("_id") @db.ObjectId
  email    String  @unique
  credits  Int     @default(50)
  plan     Plan    @default(FREE)
  transactions CreditTransaction[]
}

enum Plan {
  FREE
  PRO
  ENTERPRISE
}

model CreditTransaction {
  id          String          @id @default(auto()) @map("_id") @db.ObjectId
  userId      String          @db.ObjectId
  amount      Int             // Negative for deductions, positive for additions
  type        TransactionType
  description String
  metadata    Json?
  createdAt   DateTime        @default(now())
  user        User            @relation(fields: [userId], references: [id])
}

enum TransactionType {
  PHOTO_GENERATION
  TEXT_PROMPT
  PHOTO_ENHANCEMENT
  CREDIT_PURCHASE
  SIGNUP_BONUS
  REFUND
}
```

### Credits Service

Located at: `src/lib/credits-service.ts`

Key functions:

- `getCredits(userId)` - Get user's current credit balance
- `hasEnoughCredits(userId, amount)` - Check if user has sufficient credits
- `deductCredits(userId, amount, type, description)` - Deduct credits with transaction logging
- `addCredits(userId, amount, type, description)` - Add credits to user account
- `getTransactionHistory(userId)` - Retrieve user's transaction history

### Credits Middleware

Located at: `src/lib/credits-middleware.ts`

The `withCredits` middleware wrapper automatically:

1. Checks user authentication
2. Verifies sufficient credit balance
3. Deducts credits before processing
4. Logs transactions
5. Returns remaining credits in response headers

Usage example:

```typescript
export async function POST(request: NextRequest) {
  return withCredits(
    request,
    CREDIT_COSTS.PHOTO_GENERATION,
    "PHOTO_GENERATION",
    "Fashion Try-On Generation",
    async (userId: string) => {
      // Your API logic here
    }
  );
}
```

### UI Components

#### CreditsBadge

Displays user's current credit balance in the header.

```tsx
import { CreditsBadge } from "@/components/credits-badge";

<CreditsBadge credits={50} showLabel={true} />;
```

#### FeatureCreditCost

Shows credit cost for specific features in page titles.

```tsx
import { FeatureCreditCost } from "@/components/credits-badge";
import { CREDIT_COSTS } from "@/lib/credits-service";

<FeatureCreditCost cost={CREDIT_COSTS.PHOTO_GENERATION} size="md" />;
```

### API Endpoints

#### GET /api/credits

Returns user's current credit balance and plan.

Response:

```json
{
  "credits": 50,
  "plan": "FREE",
  "formatted": "50"
}
```

#### GET /api/credits/transactions

Returns user's transaction history.

Query params:

- `limit` - Number of transactions to return (default: 50)

Response:

```json
{
  "transactions": [
    {
      "id": "...",
      "amount": -25,
      "type": "PHOTO_GENERATION",
      "description": "Fashion Try-On Generation",
      "metadata": {},
      "createdAt": "2025-10-02T..."
    }
  ]
}
```

## Protected API Routes

The following routes now require credits:

1. `/api/fashion-try-on` - 25 credits
2. `/api/generate-models` - 25 credits
3. `/api/prompt-to-image` - 10 credits
4. `/api/img-to-prompt` - 10 credits
5. `/api/photography-enhance` - 15 credits
6. `/api/photography-presets` - 15 credits

## Error Handling

### Insufficient Credits (402)

When a user doesn't have enough credits:

```json
{
  "error": "Insufficient credits",
  "required": 25,
  "available": 10,
  "message": "You need 25 credits but only have 10. Please upgrade your plan."
}
```

### Unauthorized (401)

When user is not authenticated:

```json
{
  "error": "Unauthorized. Please sign in."
}
```

## Setup Instructions

### 1. Database Migration

Run Prisma migration to update the database schema:

```bash
npx prisma generate
npx prisma db push
```

### 2. Initialize Existing Users

For existing users who don't have credits initialized, you can run a migration script or they will automatically receive credits on their next login.

### 3. Environment Variables

Ensure these are set in your `.env` file:

- `DATABASE_URL` - MongoDB connection string
- `GEMINI_API_KEY` - For AI features
- `GOOGLE_CLIENT_ID` - For authentication
- `GOOGLE_CLIENT_SECRET` - For authentication

## Future Enhancements

### Planned Features

1. **Credit Purchase System**

   - Stripe/PayPal integration
   - Credit packages (100, 500, 1000 credits)
   - Discounted bulk purchases

2. **Subscription Plans**

   - Monthly Pro and Enterprise plans
   - Auto-renewal
   - Plan upgrades/downgrades

3. **Credit Analytics**

   - Usage dashboard
   - Spending insights
   - Cost predictions

4. **Referral System**

   - Earn credits by referring friends
   - Bonus credits for both parties

5. **Free Credit Promotions**
   - Daily login bonuses
   - Achievement-based rewards
   - Seasonal promotions

## Monitoring & Analytics

### Track Credit Usage

Monitor these metrics:

- Average credits per user
- Most popular features
- Conversion rate (free to paid)
- Credit depletion rate
- Refund requests

### Database Queries

Get total credits distributed:

```javascript
const totalCredits = await prisma.creditTransaction.aggregate({
  _sum: { amount: true },
  where: { type: "SIGNUP_BONUS" },
});
```

Get feature usage stats:

```javascript
const featureUsage = await prisma.creditTransaction.groupBy({
  by: ["type"],
  _count: true,
  _sum: { amount: true },
});
```

## Best Practices

1. **Always use the credits middleware** for protected routes
2. **Log all transactions** with descriptive messages
3. **Handle errors gracefully** with user-friendly messages
4. **Show remaining credits** in API responses
5. **Notify users** when credits are low
6. **Provide clear pricing** on feature pages
7. **Test credit flows** thoroughly before deployment

## Support

For issues or questions about the credits system:

- Check transaction logs in the database
- Review API error responses
- Monitor credit deduction patterns
- Verify middleware integration

## License

This implementation is part of the Designator application.
