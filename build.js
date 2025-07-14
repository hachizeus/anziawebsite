import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

// Define paths
const rootDir = process.cwd();
const frontendDir = path.join(rootDir, 'frontend');
const adminDir = path.join(rootDir, 'admin');
const distDir = path.join(rootDir, 'dist');

// Clean dist directory if it exists
if (fs.existsSync(distDir)) {
  fs.removeSync(distDir);
}
fs.mkdirSync(distDir);

// Build frontend
console.log('Building frontend...');
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

// Copy frontend build to dist
console.log('Copying frontend build to dist...');
fs.copySync(path.join(frontendDir, 'dist'), distDir);

// Build admin with base path
console.log('Building admin...');
// Set the base path for admin build
process.env.BASE_URL = '/admin/';
execSync('npm run build -- --base=/admin/', { cwd: adminDir, stdio: 'inherit' });

// Create admin directory in dist and copy admin build
console.log('Copying admin build to dist/admin...');
fs.mkdirSync(path.join(distDir, 'admin'));
fs.copySync(path.join(adminDir, 'dist'), path.join(distDir, 'admin'));

console.log('Build complete! The combined dist folder is ready for deployment.');