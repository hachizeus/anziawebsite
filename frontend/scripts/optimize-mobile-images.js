/**
 * Mobile Image Optimization Script
 * 
 * This script creates optimized versions of images specifically for mobile devices.
 * To use this script, you'll need to install the 'sharp' package:
 * npm install --save-dev sharp
 * 
 * Then run: node scripts/optimize-mobile-images.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Directories to process
const directories = [
  path.join(__dirname, '../public/images'),
  path.join(__dirname, '../src/assets/images')
];

// Image extensions to process
const extensions = ['.jpg', '.jpeg', '.png', '.webp'];

// Mobile breakpoints
const breakpoints = {
  sm: 640,  // Small devices
  md: 1024, // Medium devices
};

// Process each directory
directories.forEach(directory => {
  if (!fs.existsSync(directory)) {
    console.log(`Directory does not exist: ${directory}`);
    return;
  }

  // Process files in directory
  processDirectory(directory);
});

/**
 * Process all files in a directory recursively
 * @param {string} directory - Directory to process
 */
function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively process subdirectories
      processDirectory(filePath);
    } else {
      // Process image files
      const ext = path.extname(file).toLowerCase();
      if (extensions.includes(ext) && !file.includes('-640.') && !file.includes('-1024.')) {
        createResponsiveImages(filePath);
      }
    }
  });
}

/**
 * Create responsive images for different screen sizes
 * @param {string} filePath - Path to the image file
 */
async function createResponsiveImages(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const basePath = filePath.substring(0, filePath.lastIndexOf('.'));
  
  // Get image metadata
  try {
    const metadata = await sharp(filePath).metadata();
    
    // Only create responsive images for larger images
    if (metadata.width > breakpoints.sm) {
      // Create small version (640px)
      const smallPath = `${basePath}-640${ext}`;
      if (!fs.existsSync(smallPath)) {
        await sharp(filePath)
          .resize({ width: breakpoints.sm, withoutEnlargement: true })
          .toFile(smallPath);
        console.log(`Created responsive image: ${smallPath}`);
      }
      
      // Create medium version (1024px) if original is larger
      if (metadata.width > breakpoints.md) {
        const mediumPath = `${basePath}-1024${ext}`;
        if (!fs.existsSync(mediumPath)) {
          await sharp(filePath)
            .resize({ width: breakpoints.md, withoutEnlargement: true })
            .toFile(mediumPath);
          console.log(`Created responsive image: ${mediumPath}`);
        }
      }
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

console.log('Mobile image optimization complete!');