#!/usr/bin/env node

/**
 * Auto-generate gallery.json from images in public/Pic/Gallery
 * Run: node scripts/generate-gallery.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GALLERY_PATH = path.join(__dirname, '../public/Pic/Gallery');
const OUTPUT_PATH = path.join(__dirname, '../src/data/gallery.json');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

try {
  // Read all files from the gallery folder
  const files = fs.readdirSync(GALLERY_PATH);

  // Filter only image files and sort them
  const images = files
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    })
    .sort()
    .map(file => `/Pic/Gallery/${file}`);

  // Generate and save JSON
  const jsonContent = JSON.stringify(images, null, 2);
  fs.writeFileSync(OUTPUT_PATH, jsonContent);

  console.log(`✅ Gallery JSON generated successfully!`);
  console.log(`📸 Found ${images.length} images`);
  console.log(`📁 Saved to: ${OUTPUT_PATH}`);
  console.log(`\nImages added:`);
  images.slice(-5).forEach(img => console.log(`  - ${img}`));
  if (images.length > 5) {
    console.log(`  ... and ${images.length - 5} more`);
  }
} catch (error) {
  console.error('❌ Error generating gallery JSON:', error.message);
  process.exit(1);
}
