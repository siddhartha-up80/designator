# Dynamic Image Management System

This document explains the new dynamic image management system implemented in the Designator app.

## Overview

The app now automatically reads and matches model images with their corresponding product images from the `public/images` directory. The system supports flexible naming conventions and automatically pairs images based on their numbers.

## Supported Naming Conventions

The system supports these naming formats:

### Model Images

- `model1.jpg` → pairs with `product1.png`
- `model (1).jpg` → pairs with `product (1).png`
- `model2.png` → pairs with `product2.jpg`
- `model (2).png` → pairs with `product (2).jpg`

### Product Images

- `product1.png` → pairs with `model1.jpg`
- `product (1).png` → pairs with `model (1).jpg`
- `product2.jpg` → pairs with `model2.png`
- `product (2).jpg` → pairs with `model (2).png`

## File Structure

Current images in `public/images/`:

```
model (1).jpg → product (1).png
model (2).jpg → product (2).png
model (3).jpg → product (3).png
model (4).jpg → product (4).png
model (5).jpg → product (5).png
model (6).jpg → product (6).png
model (7).jpg → product (7).png
```

## How It Works

### 1. Image Service (`src/lib/image-service.ts`)

- **Automatic Detection**: Scans the `public/images` directory for model and product images
- **Smart Pairing**: Matches images based on extracted numbers from filenames
- **Fallback Support**: Uses predefined image pairs if scanning fails
- **Caching**: Caches image pairs for better performance

### 2. API Endpoint (`src/app/api/images/route.ts`)

- Serves image data to client-side components
- Provides fallback data if server-side scanning fails
- Includes caching headers for performance

### 3. Updated Components

- **Signup Page**: Now uses dynamic image loading with loading states
- **Signin Page**: Now uses dynamic image loading with loading states
- **Dev Responses**: Uses image service for random image selection

## Usage

### Adding New Images

1. **Add Model Image**: Place in `public/images/` with format `model (X).jpg` where X is the number
2. **Add Product Image**: Place corresponding product image as `product (X).png`
3. **Update Cache**: Run `npm run update-images` to refresh the image cache (optional - system auto-detects)

### Example: Adding Model 8

```
public/images/
  model (8).jpg    ← Your new model image
  product (8).png  ← Your corresponding product image
```

### Scripts

```bash
# Update image cache (optional - system auto-detects)
npm run update-images

# Start development server
npm run dev
```

## Technical Details

### Server-Side vs Client-Side

- **Server-Side**: Uses Node.js `fs/promises` to scan directories
- **Client-Side**: Fetches image data from `/api/images` endpoint
- **Fallback**: Uses hardcoded image pairs if both methods fail

### Error Handling

- **Loading States**: Components show loading spinners while fetching images
- **Empty States**: Graceful handling when no images are available
- **Fallback Data**: System continues working even if image scanning fails

### Performance Features

- **Caching**: Image pairs are cached after first load
- **Lazy Loading**: Images load only when needed
- **API Caching**: API responses cached for 1 hour

## Migration from Static Images

The system automatically migrated from static image references to dynamic loading:

### Before

```tsx
const carouselImages = [
  { src: "/images/model1.png", productSrc: "/images/product1.png" },
  { src: "/images/model2.png", productSrc: "/images/product2.png" },
  // ...hardcoded array
];
```

### After

```tsx
const [carouselImages, setCarouselImages] = useState<ModelImage[]>([]);

useEffect(() => {
  const loadImages = async () => {
    const images = await imageService.getModelImagesForCarousel();
    setCarouselImages(images);
  };
  loadImages();
}, []);
```

## API Reference

### ImageService Methods

```typescript
// Get all image pairs
await imageService.getAvailableImagePairs(): Promise<ImagePair[]>

// Get carousel-formatted images
await imageService.getModelImagesForCarousel(): Promise<ModelImage[]>

// Get random model images
await imageService.getRandomModelImages(count: number): Promise<string[]>

// Get random product images
await imageService.getRandomProductImages(count: number): Promise<string[]>

// Get specific image pair
await imageService.getImagePairById(id: number): Promise<ImagePair | null>

// Clear cache
imageService.clearCache(): void
```

### API Endpoints

```
GET /api/images
Returns: ImagePair[]
Cache: 1 hour
```

This system provides a flexible, maintainable way to manage model and product image relationships while supporting future growth and changes.
