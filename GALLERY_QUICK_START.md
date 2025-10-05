# Quick Start - Gallery Feature

## For Users

### How to Save Images to Gallery

1. **Generate Images** on any page (Product Model, Prompt to Image, etc.)
2. **Look for Green "Save" Buttons** on generated images
3. **Click "Save All to Gallery"** to save all images at once, or
4. **Click individual save buttons** on each image to save selectively

### How to View Gallery

1. Click **"Gallery"** in the sidebar
2. Browse your saved images
3. Use **filters** to view specific types (Product Model, Fashion Try-On, etc.)
4. Use **search** to find images by title

### How to Manage Images

- **Download**: Hover over image → Click download button
- **Delete**: Hover over image → Click delete button (red trash icon)

## For Developers

### Key Components

```typescript
// Save single image
const saveToGallery = async (imageUrl: string, index: number) => {
  const response = await fetch("/api/gallery/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Your Image Title",
      imageUrl: imageUrl,
      type: "PRODUCT_MODEL", // or FASHION_TRYON, PROMPT_TO_IMAGE, AI_PHOTOGRAPHY
    }),
  });
};

// Get gallery images
const fetchGallery = async () => {
  const response = await fetch("/api/gallery");
  const data = await response.json();
  return data.images;
};

// Delete image
const deleteImage = async (imageId: string) => {
  await fetch(`/api/gallery?id=${imageId}`, {
    method: "DELETE",
  });
};
```

### Image Types

```typescript
enum GalleryImageType {
  FASHION_TRYON      // Virtual try-on results
  PRODUCT_MODEL      // Product model generation
  PROMPT_TO_IMAGE    // Text-to-image generation
  AI_PHOTOGRAPHY     // AI-enhanced photography
}
```

### Database Schema

```prisma
model GalleryImage {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  title     String
  imageUrl  String   // Base64 data URL
  type      GalleryImageType
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Color Scheme

- 🟢 **Green (#16a34a)**: Save to Gallery
- 🟠 **Orange (#f97316)**: Primary actions, filters
- 🔴 **Red**: Delete actions
- ⚪ **White/Gray**: Background, cards

## UI Components Used

- Card, Button, Input (shadcn/ui)
- Lucide React icons (Save, Download, Trash2, ImageIcon, etc.)
- Toast notifications for feedback
