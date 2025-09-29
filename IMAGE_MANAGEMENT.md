# Image Management System

The Designator app now includes an automatic image management system that dynamically loads and matches model images with their corresponding product images.

## How it Works

The system automatically reads image files from `public/images/` and matches model images with product images based on their numbers:

- `model (1).jpg` is matched with `product (1).png`
- `model (2).jpg` is matched with `product (2).png`
- And so on...

## Supported Naming Conventions

The system supports multiple naming patterns:

- `model (1).jpg`, `model (2).jpg`, etc.
- `model1.jpg`, `model2.jpg`, etc.
- `product (1).png`, `product (2).png`, etc.
- `product1.png`, `product2.png`, etc.

## File Format Support

Supported image formats:

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`

## Adding New Images

### Automatic Method (Recommended)

1. Add your new images to `public/images/` following the naming convention:

   - Model images: `model (8).jpg`, `model (9).jpg`, etc.
   - Product images: `product (8).png`, `product (9).png`, etc.

2. Run the update script:

   ```bash
   npm run update-images
   ```

3. Restart your development server if it's running:
   ```bash
   npm run dev
   ```

### Manual Method

If you prefer to update the configuration manually, edit the `getFallbackImagePairs()` method in `src/lib/image-service.ts`.

## Image Service API

The image service provides several useful methods:

### `imageService.getAvailableImagePairs()`

Returns all matched image pairs with their paths.

### `imageService.getModelImagesForCarousel()`

Returns model images formatted for use in carousels (used by signin/signup pages).

### `imageService.getRandomModelImages(count)`

Returns random model image paths (used by dev-responses.ts).

### `imageService.getRandomProductImages(count)`

Returns random product image paths (used by dev-responses.ts).

### `imageService.clearCache()`

Clears the internal cache (useful when images are updated).

## Files Updated

The automatic image system updates the following files:

- **`src/lib/image-service.ts`** - Core image management service
- **`src/app/api/images/route.ts`** - API endpoint for client-side image loading
- **`src/app/signin/page.tsx`** - Updated to use dynamic image loading
- **`src/app/signup/page.tsx`** - Updated to use dynamic image loading
- **`src/lib/dev-responses.ts`** - Updated to use image service for development mode
- **`scripts/update-images.js`** - Automatic image discovery script

## Benefits

1. **Automatic Discovery**: No need to manually update code when adding new images
2. **Consistent Matching**: Model images are automatically paired with corresponding product images
3. **Fallback Support**: Graceful handling when images are missing or fail to load
4. **Cache Management**: Efficient loading with built-in caching
5. **Type Safety**: Full TypeScript support with proper interfaces

## Troubleshooting

### Images Not Showing

1. Check that images follow the naming convention
2. Run `npm run update-images` to refresh the configuration
3. Restart the development server
4. Check browser console for any loading errors

### Script Not Working

1. Ensure you're running the command from the project root
2. Check that `public/images/` directory exists
3. Verify that `src/lib/image-service.ts` exists

### Need to Add Different File Formats

The system supports jpg, jpeg, png, and webp. If you need other formats, update the regex patterns in both `image-service.ts` and `update-images.js`.

## Future Enhancements

The system is designed to be easily extensible for:

- Additional image categories (backgrounds, accessories, etc.)
- Different matching algorithms
- External image sources
- Image optimization and compression
- Metadata extraction
