# Recent Activity & Low Credit Alert Features

## Overview

This implementation adds two key features to the Designator home page:

1. **Recent Activity**: Displays the user's recent activities including image generations and credit usage
2. **Low Credit Alert**: Shows a warning when the user's credits fall below 20

## Files Added/Modified

### New Files

- `src/app/api/recent-activities/route.ts` - API endpoint for fetching recent activities
- `src/hooks/use-recent-activities.ts` - Custom React hook for managing recent activities state
- `src/app/api/test-data/route.ts` - API endpoint for creating sample data (development only)

### Modified Files

- `src/app/(main)/home/page.tsx` - Updated to display recent activities and conditional low credit alert

## Features

### Recent Activity

- Combines data from both `CreditTransaction` and `GalleryImage` models
- Shows the last 5 activities by default
- Displays activity type, description, timestamp, and credit cost
- Shows thumbnails for generated images
- Includes proper loading states and empty states
- Activities are sorted by creation date (most recent first)

### Low Credit Alert

- Dynamically checks user's current credits using the credits context
- Shows alert when credits < 20
- Displays actual credit count in the alert message
- Only appears when credits are low (conditional rendering)
- Includes a direct link to purchase more credits

## API Endpoints

### GET /api/recent-activities

**Parameters:**

- `limit` (optional): Number of activities to return (default: 10)

**Response:**

```json
{
  "activities": [
    {
      "id": "string",
      "type": "transaction" | "image",
      "action": "string",
      "description": "string",
      "createdAt": "ISO date string",
      "icon": "string",
      "credits": "number (optional)",
      "imageUrl": "string (optional)"
    }
  ]
}
```

### POST /api/test-data (Development Only)

Creates sample credit transactions and gallery images for testing purposes.

## Activity Types

### Transaction Activities

- **PHOTO_GENERATION**: Fashion Try-on, Product Model generation
- **TEXT_PROMPT**: Prompt to Image, Image to Prompt
- **PHOTO_ENHANCEMENT**: AI Photography enhancement & style presets

### Gallery Activities

- **FASHION_TRYON**: Fashion Try-On generated images
- **PRODUCT_MODEL**: Product Model generated images
- **PROMPT_TO_IMAGE**: Prompt-to-Image generated content
- **AI_PHOTOGRAPHY**: AI Photography enhanced images

## Usage

The components automatically:

- Fetch recent activities on page load
- Display appropriate icons for each activity type
- Show relative timestamps (e.g., "2h ago", "3d ago")
- Handle loading states and error conditions
- Refresh data when needed

## Testing

1. Use the "Add Test Data" button on the home page to create sample activities
2. The button creates both a credit transaction and a gallery image
3. Refresh the page to see the new activities appear

## Database Schema

The feature relies on existing Prisma models:

- `User` - for credit balance and user identification
- `CreditTransaction` - for tracking credit usage activities
- `GalleryImage` - for tracking generated image activities

## Future Enhancements

- Add real-time updates using WebSockets or Server-Sent Events
- Implement pagination for viewing more activities
- Add filtering options (by type, date range, etc.)
- Include more detailed activity metadata
- Add activity search functionality
