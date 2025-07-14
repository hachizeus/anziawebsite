import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the root directory
const rootDir = path.resolve(__dirname, '..');
const sourceFile = path.join(rootDir, 'public', '.htaccess');
const destFile = path.join(rootDir, 'dist', '.htaccess');

// Check if source file exists
if (fs.existsSync(sourceFile)) {
  // Create dist directory if it doesn't exist
  if (!fs.existsSync(path.join(rootDir, 'dist'))) {
    fs.mkdirSync(path.join(rootDir, 'dist'), { recursive: true });
  }
  
  // Copy the file
  fs.copyFileSync(sourceFile, destFile);
  console.log('✅ .htaccess file copied to dist folder');
} else {
  console.error('❌ .htaccess file not found in public folder');
  process.exit(1);
}