/**
 * Image Optimization Script
 * 
 * This script converts and optimizes images for better web performance.
 * It converts images to WebP format and creates responsive versions.
 * 
 * To use this script, run: node scripts/convert-to-webp.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to process
const directories = [
  path.join(__dirname, '../public/images'),
  path.join(__dirname, '../src/assets/images')
];

// Image extensions to convert
const extensions = ['.jpg', '.jpeg', '.png'];

// Responsive image sizes
const sizes = [640, 1024, 1920];

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
      if (extensions.includes(ext)) {
        convertToWebP(filePath);
        createResponsiveImages(filePath);
      }
    }
  });
}

/**
 * Convert an image to WebP format
 * @param {string} filePath - Path to the image file
 */
function convertToWebP(filePath) {
  const outputPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  // Skip if WebP version already exists and is newer than the source
  if (fs.existsSync(outputPath)) {
    const originalStat = fs.statSync(filePath);
    const webpStat = fs.statSync(outputPath);
    
    if (webpStat.mtime > originalStat.mtime) {
      console.log(`WebP already up to date: ${outputPath}`);
      return;
    }
  }

  sharp(filePath)
    .webp({ 
      quality: 80,
      effort: 6 // Higher compression effort (0-6)
    })
    .toFile(outputPath)
    .then(() => {
      console.log(`Converted: ${filePath} -> ${outputPath}`);
      
      // Get file sizes for comparison
      const originalSize = fs.statSync(filePath).size;
      const webpSize = fs.statSync(outputPath).size;
      const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(2);
      
      console.log(`Size reduction: ${savings}% (${(originalSize/1024).toFixed(2)}KB -> ${(webpSize/1024).toFixed(2)}KB)`);
    })
    .catch(err => {
      console.error(`Error converting ${filePath}:`, err);
    });
}

/**
 * Create responsive image versions
 * @param {string} filePath - Path to the image file
 */
function createResponsiveImages(filePath) {
  const dir = path.dirname(filePath);
  const filename = path.basename(filePath, path.extname(filePath));
  
  // Get image metadata
  sharp(filePath)
    .metadata()
    .then(metadata => {
      // Only create responsive images for larger images
      if (metadata.width > sizes[0]) {
        // Create responsive versions
        sizes.forEach(size => {
          // Skip if the requested size is larger than the original
          if (size >= metadata.width) return;
          
          const outputPath = path.join(dir, `${filename}-${size}.webp`);
          
          // Skip if responsive version exists and is newer than source
          if (fs.existsSync(outputPath)) {
            const originalStat = fs.statSync(filePath);
            const responsiveStat = fs.statSync(outputPath);
            
            if (responsiveStat.mtime > originalStat.mtime) {
              return;
            }
          }
          
          sharp(filePath)
            .resize(size)
            .webp({ quality: 75 })
            .toFile(outputPath)
            .then(() => {
              console.log(`Created responsive image: ${outputPath}`);
            })
            .catch(err => {
              console.error(`Error creating responsive image ${outputPath}:`, err);
            });
        });
      }
    })
    .catch(err => {
      console.error(`Error reading metadata for ${filePath}:`, err);
    });
}

console.log('Image optimization started...');