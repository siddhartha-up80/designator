#!/usr/bin/env node

/**
 * Guide for Adding Real-Time Credit Updates to Feature Pages
 *
 * This guide helps developers quickly implement the credit update pattern
 * in all feature pages that make API calls to protected endpoints.
 */

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  REAL-TIME CREDIT UPDATES - IMPLEMENTATION GUIDE              ║
╚═══════════════════════════════════════════════════════════════╝

📋 CHECKLIST FOR EACH FEATURE PAGE:

1. Import the useCredits hook
   ─────────────────────────────────────────────────────────────
   Add to imports:
   import { useCredits } from "@/contexts/credits-context";

2. Use the hook in your component
   ─────────────────────────────────────────────────────────────
   Add inside your component function:
   const { updateCredits } = useCredits();

3. Update credits after API calls
   ─────────────────────────────────────────────────────────────
   After your fetch() call, add:

   const response = await fetch("/api/your-endpoint", { 
     method: "POST",
     body: JSON.stringify({ /* your data */ })
   });

   // 🔥 Add this block:
   const remainingCredits = response.headers.get("X-Remaining-Credits");
   if (remainingCredits !== null) {
     const credits = parseInt(remainingCredits, 10);
     if (!isNaN(credits)) {
       updateCredits(credits);
     }
   }

   const result = await response.json();
   // ... rest of your code

───────────────────────────────────────────────────────────────

📁 PAGES THAT NEED IMPLEMENTATION:

✅ [DONE] src/app/(main)/prompt-to-image/page.tsx
⏳ [TODO] src/app/(main)/fashion-try-on/page.tsx
⏳ [TODO] src/app/(main)/product-model/page.tsx
⏳ [TODO] src/app/(main)/img-to-prompt/page.tsx
⏳ [TODO] src/app/(main)/photography/page.tsx

───────────────────────────────────────────────────────────────

🔍 HOW TO FIND THE FETCH CALL:

Search for patterns like:
- fetch("/api/fashion-try-on"
- fetch("/api/generate-models"
- fetch("/api/img-to-prompt"
- fetch("/api/photography-enhance"
- fetch("/api/photography-presets"

───────────────────────────────────────────────────────────────

💡 COMPLETE EXAMPLE:

import { useCredits } from "@/contexts/credits-context";

export default function YourFeaturePage() {
  const { updateCredits } = useCredits();

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/your-endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ /* your data */ })
      });

      // Extract and update credits from header
      const remainingCredits = response.headers.get("X-Remaining-Credits");
      if (remainingCredits !== null) {
        const credits = parseInt(remainingCredits, 10);
        if (!isNaN(credits)) {
          updateCredits(credits);
        }
      }

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Operation failed");
      }

      // Handle success...
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    // Your JSX...
  );
}

───────────────────────────────────────────────────────────────

✅ VERIFICATION STEPS:

After implementing in a page:

1. Run the dev server: npm run dev
2. Navigate to the feature page
3. Open browser DevTools -> Network tab
4. Perform an action that uses credits
5. Check the API response for "X-Remaining-Credits" header
6. Verify the header value in the top-right updates instantly
7. Open profile dialog and confirm the same value

───────────────────────────────────────────────────────────────

🎯 EXPECTED BEHAVIOR:

Before: Credits only update after page refresh
After:  Credits update immediately after any API call

───────────────────────────────────────────────────────────────

📚 DOCUMENTATION:

For more details, see:
- REAL_TIME_CREDITS.md - Complete system overview
- CREDITS_SYSTEM.md - Credits system architecture
- src/contexts/credits-context.tsx - Context implementation

───────────────────────────────────────────────────────────────

🚀 QUICK APPLY:

To apply this pattern to all pages at once:
1. Open each TODO page above
2. Search for "fetch(" in the file
3. Add the credit update code block after each fetch
4. Test each page individually

───────────────────────────────────────────────────────────────

Need help? Check the example in:
src/app/(main)/prompt-to-image/page.tsx (lines ~150-175)

╔═══════════════════════════════════════════════════════════════╗
║  Happy Coding! 🎨                                             ║
╚═══════════════════════════════════════════════════════════════╝
`);

// List the specific fetch calls in each page
console.log(`\n📝 SEARCH PATTERNS FOR EACH PAGE:\n`);

const pages = [
  {
    file: "fashion-try-on/page.tsx",
    search: 'fetch("/api/fashion-try-on"',
    credits: 25,
  },
  {
    file: "product-model/page.tsx",
    search: 'fetch("/api/generate-models"',
    credits: 25,
  },
  {
    file: "img-to-prompt/page.tsx",
    search: 'fetch("/api/img-to-prompt"',
    credits: 10,
  },
  {
    file: "photography/page.tsx",
    search:
      'fetch("/api/photography-enhance" OR fetch("/api/photography-presets"',
    credits: "15 or 15",
  },
];

pages.forEach((page, i) => {
  console.log(`${i + 1}. ${page.file}`);
  console.log(`   Search: ${page.search}`);
  console.log(`   Credits: ${page.credits}\n`);
});

console.log(`\n✨ Done! Follow the checklist above for each page.\n`);
