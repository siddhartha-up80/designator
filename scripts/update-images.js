#!/usr/bin/env node

/**
 * Image Auto-Discovery Script
 *
 * This script scans the public/images directory and updates the image service
 * with the current images, matching model images with their corresponding product images.
 *
 * Usage:
 * - Run this script after adding new images to public/images
 * - It will automatically detect and match model (1).jpg with product (1).png, etc.
 * - Updates the fallback configuration in image-service.ts
 */

const fs = require("fs");
const path = require("path");

const PUBLIC_IMAGES_DIR = path.join(process.cwd(), "public", "images");
const IMAGE_SERVICE_PATH = path.join(
  process.cwd(),
  "src",
  "lib",
  "image-service.ts"
);

/**
 * Extract the number from image filename
 */
function extractImageNumber(filename) {
  // Match patterns like model1.jpg, model (1).jpg, etc.
  const match = filename.match(/(?:model|product)(?:\s*\((\d+)\)|\s*(\d+))/i);
  if (match) {
    return parseInt(match[1] || match[2], 10);
  }
  return null;
}

/**
 * Scan the public/images directory for model and product images
 */
function scanImagesDirectory() {
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    console.error("Error: public/images directory not found!");
    return [];
  }

  const files = fs.readdirSync(PUBLIC_IMAGES_DIR);

  const modelFiles = files.filter(
    (file) =>
      file.toLowerCase().includes("model") &&
      /\.(jpg|jpeg|png|webp)$/i.test(file)
  );

  const productFiles = files.filter(
    (file) =>
      file.toLowerCase().includes("product") &&
      /\.(jpg|jpeg|png|webp)$/i.test(file)
  );

  // Group images by number
  const imageGroups = new Map();

  modelFiles.forEach((file) => {
    const id = extractImageNumber(file);
    if (id !== null) {
      if (!imageGroups.has(id)) {
        imageGroups.set(id, {});
      }
      imageGroups.get(id).model = file;
    }
  });

  productFiles.forEach((file) => {
    const id = extractImageNumber(file);
    if (id !== null) {
      if (!imageGroups.has(id)) {
        imageGroups.set(id, {});
      }
      imageGroups.get(id).product = file;
    }
  });

  // Create ImagePair objects
  const imagePairs = [];
  imageGroups.forEach((group, id) => {
    if (group.model && group.product) {
      imagePairs.push({
        id,
        modelImage: group.model,
        productImage: group.product,
        modelImagePath: `/images/${group.model}`,
        productImagePath: `/images/${group.product}`,
      });
    }
  });

  imagePairs.sort((a, b) => a.id - b.id);
  return imagePairs;
}

/**
 * Generate the TypeScript code for the fallback image pairs
 */
function generateFallbackCode(imagePairs) {
  const pairsCode = imagePairs
    .map(
      (pair) => `      {
        id: ${pair.id},
        modelImage: '${pair.modelImage}',
        productImage: '${pair.productImage}',
        modelImagePath: '${pair.modelImagePath}',
        productImagePath: '${pair.productImagePath}',
      }`
    )
    .join(",\n");

  return `    return [
${pairsCode},
    ];`;
}

/**
 * Update the image service file with the new fallback configuration
 */
function updateImageService(imagePairs) {
  if (!fs.existsSync(IMAGE_SERVICE_PATH)) {
    console.error("Error: image-service.ts not found!");
    return false;
  }

  let content = fs.readFileSync(IMAGE_SERVICE_PATH, "utf8");

  // Find and replace the getFallbackImagePairs method content
  const methodRegex =
    /(private getFallbackImagePairs\(\): ImagePair\[] \{[\s\S]*?return \[[\s\S]*?\];)/;

  const newFallbackCode = generateFallbackCode(imagePairs);
  const newMethod = `private getFallbackImagePairs(): ImagePair[] {
${newFallbackCode}
  }`;

  if (methodRegex.test(content)) {
    content = content.replace(methodRegex, newMethod);
    fs.writeFileSync(IMAGE_SERVICE_PATH, content);
    return true;
  } else {
    console.error(
      "Error: Could not find getFallbackImagePairs method to update"
    );
    return false;
  }
}

/**
 * Main function
 */
function main() {
  console.log("🔍 Scanning public/images directory...");

  const imagePairs = scanImagesDirectory();

  if (imagePairs.length === 0) {
    console.log("⚠️  No matching model-product image pairs found!");
    console.log("Make sure your images follow the naming convention:");
    console.log("  - model (1).jpg, model (2).jpg, etc.");
    console.log("  - product (1).png, product (2).png, etc.");
    return;
  }

  console.log(`✅ Found ${imagePairs.length} image pairs:`);
  imagePairs.forEach((pair) => {
    console.log(`   ${pair.id}: ${pair.modelImage} -> ${pair.productImage}`);
  });

  console.log("\\n🔄 Updating image-service.ts...");

  if (updateImageService(imagePairs)) {
    console.log("✅ Successfully updated image-service.ts!");
    console.log("\\n🚀 Your app will now automatically use the new images.");
    console.log("   You may need to restart your development server.");
  } else {
    console.log("❌ Failed to update image-service.ts");
  }
}

// Run the script
main();
