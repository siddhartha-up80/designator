# Development Mode Configuration

This document explains how the development mode fake responses are implemented to save on Gemini API costs during development.

## How It Works

When `NODE_ENV=development` is set in your environment variables, all Gemini API calls are intercepted and replaced with fake responses that include:

1. **Random model/product images** from the `public/images/` folder
2. **Sample text responses** appropriate for each API context
3. **Consistent response structures** matching the production API

## Environment Setup

Ensure your `.env` file contains:

```
NODE_ENV=development
```

## APIs Modified

The following API routes now support development mode:

### 1. `/api/generate-models`

- **Returns**: Fake model generation responses with placeholder images
- **Images**: Random selection from `model*.png` files
- **Text**: Fashion-focused sample descriptions

### 2. `/api/fashion-try-on`

- **Returns**: Virtual try-on simulation results
- **Images**: Random model images as try-on results
- **Text**: Try-on process descriptions
- **Database**: Still creates records for consistency

### 3. `/api/prompt-to-image`

- **Returns**: Text-to-image generation results
- **Images**: Random model/product images
- **Text**: Fashion and photography descriptions
- **Multiple**: Supports generating multiple images

### 4. `/api/img-to-prompt`

- **Returns**: Image analysis and prompt generation
- **Text**: Multiple fashion-related prompts
- **No Images**: Text-only response

### 5. `/api/photography-enhance`

- **Returns**: Image enhancement results
- **Images**: Random enhanced model images
- **Text**: Enhancement process descriptions

### 6. `/api/photography-presets`

- **Returns**: Photography preset application results
- **Images**: Random styled model images
- **Text**: Preset application descriptions

## Available Images

The system randomly selects from these image files:

**Model Images:**

- `model1.png`, `model1_2.png`, `model1_3.png`
- `model2.png`, `model5.png`, `model6.png`, `model7.png`

**Product Images:**

- `product1.png`, `product2.png`, `product3.png`, `product5.png`

## Response Structure

All fake responses maintain the same structure as production APIs but include:

- `[DEV MODE]` suffix in success messages
- Placeholder base64 image data
- Consistent sample text content
- Proper error handling

## Testing

Use the test endpoint to verify development mode:

```
GET /api/dev-test?type=model
GET /api/dev-test?type=tryon
GET /api/dev-test?type=prompt
GET /api/dev-test?type=img2prompt
GET /api/dev-test?type=enhance
GET /api/dev-test?type=preset
```

## Production Behavior

When `NODE_ENV` is not set to `development`, all APIs function normally with actual Gemini API calls.

## Benefits

1. **Cost Savings**: No Gemini API calls during development
2. **Fast Response**: Instant responses without network delays
3. **Offline Development**: Works without internet connection
4. **Consistent Testing**: Predictable responses for UI testing
5. **Database Testing**: Database operations still work for data flow testing
