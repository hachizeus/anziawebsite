import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create directories if they don't exist
const publicImagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Copy logo.svg to public/images
const srcLogoPath = path.join(__dirname, 'src', 'assets', 'images', 'logo.svg');
const destLogoPath = path.join(publicImagesDir, 'logo.svg');

try {
  fs.copyFileSync(srcLogoPath, destLogoPath);
  console.log('Logo copied successfully to public/images/logo.svg');
} catch (err) {
  console.error('Error copying logo:', err);
}