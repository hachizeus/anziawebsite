/**
 * CSS Purge Script
 * 
 * This script removes unused CSS from the build output.
 * To use this script, you'll need to install the 'purgecss' package:
 * npm install --save-dev @fullhuman/postcss-purgecss
 * 
 * This script is automatically used during the build process via postcss.config.js
 */

const fs = require('fs');
const path = require('path');
const { PurgeCSS } = require('purgecss');

// Directories to analyze
const content = [
  './src/**/*.{js,jsx}',
  './index.html',
];

// CSS files to purge
const css = [
  './dist/assets/css/*.css',
];

// Run PurgeCSS
async function purge() {
  console.log('Running PurgeCSS...');
  
  const result = await new PurgeCSS().purge({
    content,
    css,
    safelist: {
      standard: [
        /^bg-/,
        /^text-/,
        /^border-/,
        /^hover:/,
        /^focus:/,
        /^active:/,
        /^disabled:/,
        /^sm:/,
        /^md:/,
        /^lg:/,
        /^xl:/,
        /^2xl:/,
        /^dark:/,
        /^motion-/,
        /^animate-/,
      ],
      deep: [
        /^chakra-/,
        /^react-/,
      ],
    },
  });
  
  // Write purged CSS back to files
  result.forEach((purgedCss) => {
    fs.writeFileSync(purgedCss.file, purgedCss.css);
    
    // Get file size before and after
    const originalSize = fs.statSync(purgedCss.file).size;
    const newSize = purgedCss.css.length;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(2);
    
    console.log(`Purged ${purgedCss.file}: ${savings}% reduction (${(originalSize/1024).toFixed(2)}KB -> ${(newSize/1024).toFixed(2)}KB)`);
  });
  
  console.log('CSS purging complete!');
}

purge().catch(err => {
  console.error('Error during CSS purging:', err);
  process.exit(1);
});